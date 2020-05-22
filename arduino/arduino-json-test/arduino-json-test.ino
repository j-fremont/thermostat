#include <ArduinoJson.h>

const int capacity = 100; //JSON_OBJECT_SIZE(3) + 4 * JSON_OBJECT_SIZE(3) + 4 * JSON_ARRAY_SIZE(7) + 28 * JSON_OBJECT_SIZE(1);

StaticJsonDocument<capacity> doc;
//DynamicJsonDocument doc(capacity);

//int ntp_day = 3, ntp_hours = 15, ntp_minutes = 30; // Relay OFF !
int ntp_day = 3, ntp_hours = 19, ntp_minutes = 30; // Relay ON !
//int ntp_day = 5, ntp_hours = 19, ntp_minutes = 30; // Relay OFF !
//int ntp_day = 5, ntp_hours = 9, ntp_minutes = 30; // Relay ON !

int dht_measurement = 5;

boolean onRange(int hours, int minutes, const char* begin, const char* end);

void setup() {

  //char json[] = "{\"mode\":\"auto\", \"forced\":30, \"normal\":20, \"ranges\":[{\"value\":30, \"start\":\"06:00\", \"end\":\"08:00\", \"days\":[true, true, true, true, true, false, false]}, {\"value\":30, \"start\":\"18:00\", \"end\":\"20:00\", \"days\":[true, true, true, true, true, false, false]}, {\"value\":30, \"start\":\"08:00\", \"end\":\"10:00\", \"days\":[false, false, false, false, false, true, true]}, {\"value\":30, \"start\":\"19:00\", \"end\":\"21:00\", \"days\":[false, false, false, false, false, true, true]}]}";
  //char json[] = "{\"mode\":\"auto\", \"forced\":30, \"normal\":20, \"ranges\":[{\"value\":30, \"start\":\"06:00\", \"end\":\"08:00\", \"days\":[true, true, true, true, true, false, false]}, {\"value\":30, \"start\":\"18:00\", \"end\":\"20:00\", \"days\":[true, true, true, true, true, false, false]}, {\"value\":30, \"start\":\"08:00\", \"end\":\"10:00\", \"days\":[false, false, false, false, false, true, true]}]}";
  //char json[] = "{\"mode\":\"auto\", \"forced\":30, \"normal\":20, \"ranges\":[{\"value\":30, \"start\":\"06:00\", \"end\":\"08:00\", \"days\":[true, true, true, true, true, false, false]}, {\"value\":30, \"start\":\"18:00\", \"end\":\"20:00\", \"days\":[true, true, true, true, true, false, false]}]}";
  //char json[] = "{\"mode\":\"auto\", \"forced\":30, \"normal\":20, \"ranges\":[{\"value\":30, \"start\":\"06:00\", \"end\":\"08:00\", \"days\":[true, true, true, true, true, false, false]}]}";
  char json[] = "{\"mode\":\"auto\", \"forced\":30, \"normal\":20, \"ranges\":[]}";
  
  Serial.begin(115200);

  Serial.print(capacity);
  Serial.print("\n");

  Serial.print(sizeof(json));
  Serial.print("\n");
  
  DeserializationError error = deserializeJson(doc, json);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  
  const char* mode = doc["mode"];
  float forced = doc["forced"];
  float normal = doc["normal"];

  Serial.print("mode: ");
  Serial.println(mode);
  Serial.print("forced: ");
  Serial.println(forced);
  Serial.print("normal: ");
  Serial.println(normal);


  int nb_range = 0;

  for (int i=0;;i++) {
    
    float value = doc["ranges"][i]["value"];

    if (value==0) {
      break;
    }

    const char* start = doc["ranges"][i]["start"];
    const char* _end = doc["ranges"][i]["end"];

    Serial.print("plage : ");
    Serial.println(i);
    Serial.print("value : ");
    Serial.println(value);
    Serial.print("start : ");
    Serial.println(start);
    Serial.print("end : ");
    Serial.println(_end);
    
    nb_range++;

    /*boolean on_range = onRange(15, 30, "18:15", "20:45");
    Serial.print("on range : ");
    Serial.println(on_range);
    on_range = onRange(18, 30, "18:15", "20:45");
    Serial.print("on range : ");
    Serial.println(on_range);
    on_range = onRange(20, 55, "18:15", "20:45");
    Serial.print("on range : ");
    Serial.println(on_range);*/

    /*const boolean monday = doc["ranges"][i]["days"][0];
    const boolean tuesday = doc["ranges"][i]["days"][1];
    const boolean wednesday = doc["ranges"][i]["days"][2];
    const boolean thursday = doc["ranges"][i]["days"][3];
    const boolean friday = doc["ranges"][i]["days"][4];
    const boolean saturday = doc["ranges"][i]["days"][5];
    const boolean sunday = doc["ranges"][i]["days"][6];

    boolean days[7] = {monday, tuesday, wednesday, thursday, friday, saturday, sunday};*/

    /*boolean on_day = days[3];
    Serial.print("on day : ");
    Serial.println(on_day);
    on_day = days[5];
    Serial.print("on day : ");
    Serial.println(on_day);*/
  
  
  }


  if (mode=="off") {
    Serial.print("Relay OFF !");
    
  } else if (mode == "forced") {
    if (dht_measurement < forced) {
      Serial.print("Relay ON !");
    } else {
      Serial.print("Relay OFF !");
    }
    
  } else {

    for (int i=0;i<nb_range;i++) {

      /*float value = 20;
      const char start[] = "18:00";
      const char end[] = "20:00";

      const boolean monday = true;
      const boolean tuesday = true;
      const boolean wednesday = true;
      const boolean thursday = true;
      const boolean friday = true;
      const boolean saturday = false;
      const boolean sunday = false;*/

      float value = doc["ranges"][i]["value"];
      char* start = doc["ranges"][i]["start"];
      char* end = doc["ranges"][i]["end"];

      const boolean monday = doc["ranges"][i]["days"][0];
      const boolean tuesday = doc["ranges"][i]["days"][1];
      const boolean wednesday = doc["ranges"][i]["days"][2];
      const boolean thursday = doc["ranges"][i]["days"][3];
      const boolean friday = doc["ranges"][i]["days"][4];
      const boolean saturday = doc["ranges"][i]["days"][5];
      const boolean sunday = doc["ranges"][i]["days"][6];
      
      boolean days[7] = {monday, tuesday, wednesday, thursday, friday, saturday, sunday};

      if (days[ntp_day] && onRange(ntp_hours, ntp_minutes, start, end)) {

        if (dht_measurement < value) {
          Serial.print("Relay ON !");
        } else {
          Serial.print("Relay OFF !");
        }

        break;        
      }

      if (dht_measurement < normal) {
        Serial.print("Relay ON !");
      } else {
        Serial.print("Relay OFF !");
      }
    }
  }
}

void loop() {
  
}

boolean onRange(int hours, int minutes, const char* begin, const char* end) {

  int current = (hours * 60) + minutes;

  // begin = "hh:mm" => begin_hours = "hh", begin_minutes = "mm"
  char begin_hours[3] = { begin[0], begin[1], 0 };
  char begin_minutes[3] = { begin[3], begin[4], 0 };
  int i_begin_hours = atoi(begin_hours);
  int i_begin_minutes = atoi(begin_minutes);
  int i_begin = (i_begin_hours * 60) + i_begin_minutes;

  // end = "hh:mm" => end_hours = "hh", end_minutes = "mm"
  char end_hours[3] = { end[0], end[1], 0 };
  char end_minutes[3] = { end[3], end[4], 0 };
  int i_end_hours = atoi(end_hours);
  int i_end_minutes = atoi(end_minutes);
  int i_end = (i_end_hours * 60) + i_end_minutes;

  if (i_begin > i_end) {
    return false;
  } else if (i_begin < current && current < i_end) {
    return true;
  } else {
    return false;
  }
}
