h #include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <DHT.h>

#define WIFI_SSID "MY_SSID"
#define WIFI_PASS "MY_PASS"

#define MOSQUITTO_IP "192.168.1.10"

#define DHT_TYPE DHT11
#define DHT_PIN D1
#define RELAY_PIN D3

IPAddress ipadress(192, 168, 1, 11);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns(192, 168, 1, 1);

WiFiServer server(8000);

// Define DHT to measure temperature
DHT dht(DHT_PIN, DHT_TYPE);

// Define NTP client to get time
//const long utcOffsetInSeconds = 3600; // UTC+1 : heure d'hiver
const long utcOffsetInSeconds = 7200; // UTC+2 : heure d'été
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

// Define MQTT server to send measurements
WiFiClient espClient;
PubSubClient mqttClient(espClient);
const String sensor = String("bathroom");

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

// [0]     : 0:off, 1:auto, 2:forced
// [1-2]   : forced or normal temperature, 2 digits
// [3]     : 0, 1, 2, 3 or 4 slots
// [4-5]   : slot 1 - temperature value, 2 digits
// [6-9]   : slot 1 - start, "HHMM" format
// [10-13] : slot 1 - end, "HHMM" format
// [14-20] : slot 1 - days, 7 digits (0 or 1)
// [21-22] : slot 2 - temperature value
// [23-26] : slot 2 - start
// [27-30] : slot 2 - end
// [31-37] : slot 2 - days
// [38-39] : slot 3 - temperature value
// [40-43] : slot 3 - start
// [44-47] : slot 3 - end
// [48-54] : slot 3 - days
// [55-56] : slot 4 - temperature value
// [57-60] : slot 4 - start
// [61-64] : slot 4 - end
// [65-71] : slot 4 - days

char slots[100] = "12022506000800111111125180020001111111";

//char slots[100] = "0";
//char slots[100] = "1200";
//char slots[100] = "120130060008001111100"; // Slot 1 : 30° btw 06:00-08:00 from Monday to Friday
//char slots[100] = "12023006000800111110030180020001111100"; // Slot 2 : 30° btw 18:00-20:00 from Monday to Friday
//char slots[100] = "1203300600080011111003018002000111110030080010000000011"; // Slot 3 : 30° btw 08:00-10:00 from Saturday & Sunday
//char slots[100] = "120430060008001111100301800200011111003008001000000001130190021000000011"; // Slot 4 : 30° btw 19:00-21:00 from Saturday & Sunday
//char slots[100] = "230";

int SLOT_SIZE = 17;

int tick = 0;

float t = 0, h = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("WiFi connect...");
  WiFi.config(ipadress, gateway, subnet, dns);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print( "." );
  }
  server.begin();
  Serial.println("WiFi connected !");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(RELAY_PIN, OUTPUT);
    
  timeClient.begin();

  mqttClient.setServer(MOSQUITTO_IP, 1883);
}

void loop() {

  WiFiClient client = server.available(); // Listen for incoming clients.
  
  if (client) { // If a new client connects...
    
    Serial.println("New client...");
    int i=0;
    slots[100] = {0};
    while (client.connected()) { // ...loop while the client's connected.
      if (client.available()) { // if there's bytes to read from the client...
        char c = client.read(); // ...read the byte.
        Serial.write(c);
        slots[i++]=c;
        if (c == 'E') {
          client.stop();
          client.flush();
          slots[i++]=0xD;
          slots[i++]=0xA;          
        }
      }
    }
    Serial.println("\nEnd of transmission\n");
  }

  if (tick == 600) { // Send measurements every 10 minutes

    tick=0;

    mqttClient.connect("ESP8266");
    Serial.println("MQTT connect...");
    delay(1000);
    
    if (mqttClient.connected()) {

      if (!isnan(t)) {
        String t_msg = String("{\"sensor\":\"") + sensor + String("\",\"value\":") + String(t) + String("}");
        mqttClient.publish("temperature", t_msg.c_str());
      }

      if (!isnan(h)) {
        String h_msg = String("{\"sensor\":\"") + sensor + String("\",\"value\":") + String(h) + String("}");
        mqttClient.publish("humidity", h_msg.c_str());
      }
    }
  }

  if (tick%60 == 0) { // Re-evaluate temperature vs. slots every minutes

    timeClient.update();

    dht.begin();
    t = dht.readTemperature();
    h = dht.readHumidity();
    Serial.println((float)t, 1);
    Serial.println((float)h, 1);
    Serial.print("Slots:");
    Serial.print(slots);
    Serial.print(daysOfTheWeek[timeClient.getDay()]);
    Serial.print(", ");
    Serial.print(timeClient.getHours());
    Serial.print(":");
    Serial.print(timeClient.getMinutes());
    Serial.print(":");
    Serial.println(timeClient.getSeconds());

    if (relayOn(t, timeClient.getDay(), timeClient.getHours(), timeClient.getMinutes())) {
      Serial.println("Relay ON !\n");
      digitalWrite (RELAY_PIN, HIGH);
    } else {
      Serial.println("Relay OFF !\n");
      digitalWrite (RELAY_PIN, LOW);
    }
  }

  delay(1000);
  
  tick++; // 1 tick = 1 second
    
}

boolean relayOn(int temperature, int ntp_day, int ntp_hours, int ntp_minutes)
{
  if (slots[0]=='0') { // Off
    return false;
    
  } else if (slots[0]=='2') { // Forced

    char forced[3];
    strncpy(forced, &slots[1], 2);

    if (temperature < atoi(forced)) {
      return true;
    } else {
      return false;
    }

  } else { // Auto

    boolean relay;

    char normal[3] = {0};
    strncpy(normal, &slots[1], 2);
    
    if (temperature < atoi(normal)) { // Default value (out of slot)
      relay = true;
    } else {
      relay = false;
    }

    char nb_slots[2] = {0};
    strncpy(nb_slots, &slots[3], 1);

    int i_nb_slots = atoi(nb_slots); // 0, 1, 2, 3 or 4 slots

    for (int i=0;i<i_nb_slots;i++) {

      char value[3] = {0};
      strncpy(value, &slots[4+(SLOT_SIZE*i)], 2);
      char start[5] = {0};
      strncpy(start, &slots[6+(SLOT_SIZE*i)], 4);
      char end[5] = {0};
      strncpy(end, &slots[10+(SLOT_SIZE*i)], 4);
      char days[8] = {0};
      strncpy(days, &slots[14+(SLOT_SIZE*i)], 7);
      
      if (days[ntp_day]=='1' && onSlot(ntp_hours, ntp_minutes, start, end)) {

        if (temperature < atoi(value)) {
          relay = true;
        } else {
          relay = false;
        }

        break;  
      }
    }

    return relay;
  }
}

boolean onSlot(int hours, int minutes, const char* start, const char* end)
{
  int current = (hours * 60) + minutes;

  // start = "hhmm" => begin_hours = "hh", begin_minutes = "mm"
  char start_hours[3] = { start[0], start[1], 0 };
  char start_minutes[3] = { start[2], start[3], 0 };
  int i_start = (atoi(start_hours) * 60) + atoi(start_minutes);

  // end = "hhmm" => end_hours = "hh", end_minutes = "mm"
  char end_hours[3] = { end[0], end[1], 0 };
  char end_minutes[3] = { end[2], end[3], 0 };
  int i_end = (atoi(end_hours) * 60) + atoi(end_minutes);

  if (i_start > i_end) {
    return false;
  } else if (i_start < current && current < i_end) {
    return true;
  } else {
    return false;
  }
}
