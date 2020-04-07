#include <PubSubClient.h>
#include <ESP8266WiFi.h>

#define WIFI_SSID "NEUF_4EEC"
#define WIFI_PASS "yosickkobkowgawboit0"

#define MOSQUITTO_IP "192.168.1.39"

WiFiClient espClient;
PubSubClient client(espClient);

// Function prototypes
void subscribeReceive(char* topic, byte* payload, unsigned int length);

void setup_wifi() {
  Serial.print("Connexion a ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_BUILTIN,HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN,LOW);
    delay(250);
  }

  Serial.println("Connexion WiFi etablie ");
  Serial.print("=> Addresse IP : ");
  Serial.print(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connexion au serveur MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("OK");
    } else {
      Serial.print("KO, erreur : ");
      Serial.print(client.state());
      Serial.println(" On attend 5 secondes avant de recommencer");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(MOSQUITTO_IP, 1883);
  client.setCallback(subscribeReceive);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  client.subscribe("thermostat");

  delay(5000);
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
