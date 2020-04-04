#include <DHT.h>

#define DHT_PIN 4
#define DHT_TYPE DHT11
#define RELAY_PIN 10

DHT dht(DHT_PIN, DHT_TYPE);

float setpoint = 23.0;
float _step = 0.5;

void setup ()
{
  Serial.begin(115200);

  pinMode (RELAY_PIN, OUTPUT); // Define port attribute is output;
  digitalWrite (RELAY_PIN, LOW);
}

void loop ()
{
  dht.begin();
  float t = dht.readTemperature();
  Serial.println((float)t, 1);

  if (t < setpoint-_step) {
    digitalWrite (RELAY_PIN, HIGH); // relay conduction;
  } else if (t > setpoint+_step) {
    digitalWrite (RELAY_PIN, LOW); // relay switch is turned off;
  }

  delay (5000);
}
