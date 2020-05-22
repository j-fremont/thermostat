#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <DHT.h>

#define WIFI_SSID "MY_SSID"
#define WIFI_PASS "MY_PASS"

#define DHT_TYPE DHT11
#define DHT_PIN D1
#define RELAY_PIN 0

const long utcOffsetInSeconds = 3600;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

DHT dht(DHT_PIN, DHT_TYPE);

int RANGE_SIZE = 17;
float setpoint = 23.0;
float _step = 0.5;

// [0]     : 0:off, 1:auto, 2:forced
// [1-2]   : forced temperature
// [3-4]   : normal temperature
// [5-6]   : range 1 - temperature value
// [7-10]  : range 1 - start
// [11-14] : range 1 - end
// [15-21] : range 1 - days
// [22-23] : range 2 - temperature value
// [24-27] : range 2 - start
// [28-31] : range 2 - end
// [32-38] : range 2 - days
// [39-40] : range 3 - temperature value
// [41-44] : range 3 - start
// [45-48] : range 3 - end
// [49-55] : range 3 - days
// [56-57] : range 4 - temperature value
// [58-61] : range 4 - start
// [62-65] : range 4 - end
// [66-72] : range 4 - days

//char m[80] = "0";
//char m[80] = "13020";
//char m[80] = "1302030600008001111100"; // Range 1 : 30° btw 06:00-08:00 from Monday to Friday
char m[80] = "130203060000800111110030180020001111100"; // Range 2 : 30° btw 18:00-20:00 from Monday to Friday
//char m[80] = "13020306000080011111003018002000111110030080010000000011"; // Range 3 : 30° btw 08:00-10:00 from Saturday & Sunday
//char m[80] = "1302030600008001111100301800200011111003008001000000001130190021000000011"; // Range 4 : 30° btw 19:00-21:00 from Saturday & Sunday
//char m[80] = "23020";

void setup ()
{
  Serial.begin(115200);

  pinMode (RELAY_PIN, OUTPUT); // Define port attribute is output;
  digitalWrite (RELAY_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while ( WiFi.status() != WL_CONNECTED ) {
    digitalWrite(LED_BUILTIN,HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN,LOW);
    delay(250);
    Serial.print ( "." );
  }

  timeClient.begin();
}

void loop ()
{
  dht.begin();
  float t = dht.readTemperature();
  Serial.println((float)t, 1);

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

  delay (5000);
}

boolean relayOn(int temperature, int ntp_day, int ntp_hours, int ntp_minutes, const char* message) {

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
    strncpy(normal, &m[3], 2);
    
    if (temperature < atoi(normal)) { // Default value (out of range)
      relay = true;
    } else {
      relay = false;
    }

    int nb_range = (strlen(m)-5)/RANGE_SIZE; // 0, 1, 2, 3 or 4 ranges

    for (int i=0;i<nb_range;i++) {

      char value[3];
      strncpy(value, &m[5+(RANGE_SIZE*i)], 2);
      char start[5];
      strncpy(start, &m[7+(RANGE_SIZE*i)], 4);
      char end[5];
      strncpy(end, &m[11+(RANGE_SIZE*i)], 4);
      char days[8];
      strncpy(days, &m[15+(RANGE_SIZE*i)], 7);
      
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

boolean onRange(int hours, int minutes, const char* start, const char* end) {

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
