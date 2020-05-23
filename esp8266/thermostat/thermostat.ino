#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <DHT.h>

#define WIFI_SSID "MY_SSID"
#define WIFI_PASS "MY_PASS"

#define MOSQUITTO_IP "192.168.1.10"

#define DHT_TYPE DHT11
#define DHT_PIN D1
#define LED_WIFI D2
#define RELAY_PIN D3

const long utcOffsetInSeconds = 3600;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

DHT dht(DHT_PIN, DHT_TYPE);

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

// Wifi client for MQTT
WiFiClient espClient;
PubSubClient mqttClient(espClient);

const String sensor = String("dryer");

int RANGE_SIZE = 17;


// [0]     : 0:off, 1:auto, 2:forced
// [1-2]   : forced or normal temperature
// [3-4]   : range 1 - temperature value
// [5-8]   : range 1 - start
// [9-12]  : range 1 - end
// [13-19] : range 1 - days
// [20-21] : range 2 - temperature value
// [22-25] : range 2 - start
// [26-29] : range 2 - end
// [30-36] : range 2 - days
// [37-38] : range 3 - temperature value
// [39-42] : range 3 - start
// [43-46] : range 3 - end
// [47-53] : range 3 - days
// [54-55] : range 4 - temperature value
// [56-59] : range 4 - start
// [60-63] : range 4 - end
// [64-70] : range 4 - days

//char m[80] = "0";
//char m[80] = "120";
//char m[80] = "12030060008001111100"; // Range 1 : 30° btw 06:00-08:00 from Monday to Friday
//char m[80] = "1203006000800111110030180020001111100"; // Range 2 : 30° btw 18:00-20:00 from Monday to Friday
//char m[80] = "120300600080011111003018002000111110030080010000000011"; // Range 3 : 30° btw 08:00-10:00 from Saturday & Sunday
//char m[80] = "12030060008001111100301800200011111003008001000000001130190021000000011"; // Range 4 : 30° btw 19:00-21:00 from Saturday & Sunday
char m[80] = "230";

// Function prototypes
void subscribeReceive(char* topic, byte* payload, unsigned int length);

void setup()
{
  Serial.begin(115200);

  pinMode (LED_WIFI, OUTPUT);
  pinMode (RELAY_PIN, OUTPUT); // Define port attribute is output;
  
  digitalWrite (RELAY_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while ( WiFi.status() != WL_CONNECTED ) {
    digitalWrite(LED_WIFI,HIGH);
    delay(250);
    digitalWrite(LED_WIFI,LOW);
    delay(250);
    Serial.print ( "." );
  }
  
  Serial.println("WiFi connected...");

  mqttClient.setServer(MOSQUITTO_IP, 1883);
  mqttClient.setCallback(subscribeReceive);
  
  timeClient.begin();
}

void loop()
{
  dht.begin();
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.println((float)t, 1);

  mqttClient.connect("ESP8266");
  Serial.println("MQTT connect...");
  mqttClient.loop();
  mqttClient.subscribe("thermostat");
  
  if (mqttClient.connected()) {
    String t_msg = String("{\"sensor\":\"") + sensor + String("\",\"value\":") + String(t) + String("}");
    mqttClient.publish("temperature", t_msg.c_str());
    String h_msg = String("{\"sensor\":\"") + sensor + String("\",\"value\":") + String(h) + String("}");
    mqttClient.publish("humidity", h_msg.c_str());
  }
 
  timeClient.update();

  Serial.print(daysOfTheWeek[timeClient.getDay()]);
  Serial.print(", ");
  Serial.print(timeClient.getHours());
  Serial.print(":");
  Serial.print(timeClient.getMinutes());
  Serial.print(":");
  Serial.println(timeClient.getSeconds());

  if (relayOn(t, timeClient.getDay(), timeClient.getHours(), timeClient.getMinutes(), m)) {
    Serial.print("\nRelay ON !");
    digitalWrite (RELAY_PIN, HIGH);
  } else {
    Serial.print("\nRelay OFF !");
    digitalWrite (RELAY_PIN, LOW);
  }

  delay (30000);
}

void subscribeReceive(char* topic, byte* payload, unsigned int length)
{
  // Print the topic
  Serial.print("Topic: ");
  Serial.println(topic);

  strncpy(m, (char*)payload, length);
 
  // Print the message
  Serial.print("Message: ");
  for(int i = 0; i < length; i++)
  {
    Serial.print(char(m[i]));
  }
 
  // Print a newline
  Serial.println("");
}

boolean relayOn(int temperature, int ntp_day, int ntp_hours, int ntp_minutes, const char* message)
{
  if (message[0]=='0') { // Off
    return false;
    
  } else if (m[0]=='2') { // Forced

    char forced[3];
    strncpy(forced, &m[1], 2);

    if (temperature < atoi(forced)) {
      return true;
    } else {
      return false;
    }

  } else { // Auto

    boolean relay;

    char normal[3];
    strncpy(normal, &m[1], 2);
    
    if (temperature < atoi(normal)) { // Default value (out of range)
      relay = true;
    } else {
      relay = false;
    }

    int nb_range = (strlen(m)-5)/RANGE_SIZE; // 0, 1, 2, 3 or 4 ranges

    for (int i=0;i<nb_range;i++) {

      char value[3];
      strncpy(value, &m[3+(RANGE_SIZE*i)], 2);
      char start[5];
      strncpy(start, &m[5+(RANGE_SIZE*i)], 4);
      char end[5];
      strncpy(end, &m[9+(RANGE_SIZE*i)], 4);
      char days[8];
      strncpy(days, &m[13+(RANGE_SIZE*i)], 7);
      
      if (days[ntp_day]=='1' && onRange(ntp_hours, ntp_minutes, start, end)) {

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

boolean onRange(int hours, int minutes, const char* start, const char* end)
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
