#include <Ethernet.h>
#include <PubSubClient.h>
#include <DHT.h>

#define MOSQUITTO_IP "192.168.1.10"

#define DHT_PIN 4
#define DHT_TYPE DHT11
#define RELAY_PIN 10

DHT dht(DHT_PIN, DHT_TYPE);

float setpoint = 23.0;
float _step = 0.5;

byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};

IPAddress ip(192, 168, 1, 20);



void setup ()
{
  Serial.begin(115200);

  Ethernet.begin(mac, ip);
  

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

/*
  digitalWrite (RELAY_PIN, HIGH); // relay conduction;
  delay (10000);
  digitalWrite (RELAY_PIN, LOW); // relay switch is turned off;
  delay (10000);
*/
}

/*
byte mac[] = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(172, 16, 0, 100);

EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("arduinoClient")) {
      Serial.println("connected");
      mqttClient.subscribe("thermostat");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(57600);
  
  mqttClient.setServer(server, 1883);
  mqttClient.setCallback(callback);

  Ethernet.begin(mac, ip);

  delay(1500);
}

void loop()
{
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
}

*/
