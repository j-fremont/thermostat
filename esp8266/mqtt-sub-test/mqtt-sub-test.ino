#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define WIFI_SSID "MY_SSID"
#define WIFI_PASS "MY_PASS"

#define MOSQUITTO_IP "192.168.1.10"

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Function prototypes
void subscribeReceive(char* topic, byte* payload, unsigned int length);

void setup() {

  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  pinMode(LED_BUILTIN, OUTPUT);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_BUILTIN,HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN,LOW);
    delay(250);
  }

  Serial.println("WiFi connected...");

  mqttClient.setServer(MOSQUITTO_IP, 1883);
 
  // Attempt to connect to the server with the ID "myClientID"
  if (mqttClient.connect("myClientID")) 
  {
    Serial.println("Connection has been established, well done");
 
    // Establish the subscribe event
    mqttClient.setCallback(subscribeReceive);
  } 
  else 
  {
    Serial.println("Looks like the server connection failed...");
  }

}

void loop() {
    // This is needed at the top of the loop!
  mqttClient.loop();
 
  // Ensure that we are subscribed to the topic "MakerIOTopic"
  mqttClient.subscribe("thermostat");
 
  // Attempt to publish a value to the topic "MakerIOTopic"
  /*if(mqttClient.publish("thermostat", "Hello World"))
  {
    Serial.println("Publish message success");
  }
  else
  {
    Serial.println("Could not send message :(");
  }*/
 
  // Dont overload the server!
  delay(4000);

}

void subscribeReceive(char* topic, byte* payload, unsigned int length)
{
  // Print the topic
  Serial.print("Topic: ");
  Serial.println(topic);
 
  // Print the message
  Serial.print("Message: ");
  for(int i = 0; i < length; i ++)
  {
    Serial.print(char(payload[i]));
  }
 
  // Print a newline
  Serial.println("");
}
