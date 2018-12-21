#include <ArduinoJson.h>
#include <string.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <MicroGear.h>
#define WIFI_SSID "pangchn"
#define WIFI_PASSWORD "p028742281"
#define APPID   "HappyPetGuardian"
#define KEY     "DhQ7J0ZqczwX3zT"
#define SECRET  "HdlmBApJUDQ3jHSTvi4XXJTgB"
#define ALIAS   "NodeMCU"

SoftwareSerial stm32Serial(13,15); //RX,TX
WiFiClient client;
int timer = 0;
int maxFeed = 8;
int foodPerFeed = 100;
MicroGear microgear(client);

void onMsghandler(char *topic, uint8_t* msg, unsigned int msglen) {
    Serial.print("Incoming message --> ");
    msg[msglen] = '\0';
    Serial.println((char *)msg);
    char *ptr;
    ptr = strtok((char*)msg," ");
    Serial.println(ptr);
    if(strcmp((char*)msg, "Feeding")==0){
      stm32Serial.write("1      ");
    }
      
    else if(strcmp(ptr,"config")==0){
      ptr = strtok(NULL," ");//ptr point to second element.
      maxFeed = atoi(ptr);
      Serial.print("Max Feed = ");
      Serial.print(maxFeed);

      ptr = strtok(NULL," ");//ptr point to third element.
      foodPerFeed = atoi(ptr);
      Serial.print(", Food Per Feed = ");
      Serial.println(foodPerFeed);

      char message[256];
      sprintf(message, "2 %d %d", maxFeed, foodPerFeed);
      Serial.println(message);
      stm32Serial.write(message);
    }
}

void onFoundgear(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.print("Found new member --> ");
    for (int i=0; i<msglen; i++)
        Serial.print((char)msg[i]);
    Serial.println();  
}

void onLostgear(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.print("Lost member --> ");
    for (int i=0; i<msglen; i++)
        Serial.print((char)msg[i]);
    Serial.println();
}

/* When a microgear is connected, do this */
void onConnected(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.println("Connected to NETPIE...");
    /* Set the alias of this microgear ALIAS */
}

void setup() {
  // put your setup code here, to run once:
   microgear.on(MESSAGE,onMsghandler);

    /* Call onFoundgear() when new gear appear */
    microgear.on(PRESENT,onFoundgear);

    /* Call onLostgear() when some gear goes offline */
    microgear.on(ABSENT,onLostgear);

    /* Call onConnected() when NETPIE connection is established */
    microgear.on(CONNECTED,onConnected);

  Serial.begin(115200);
  Serial.println("Starting...");
  stm32Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println(".");
     delay(500);
  }
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  microgear.init(KEY,SECRET,ALIAS);
    /* connect to NETPIE to a specific APPID */
    microgear.connect(APPID);
}

void loop() {
  // put your main code here, to run repeatedly:
  //Serial.println(microgear.connected());
  if (microgear.connected())
        microgear.loop();
    else {
        Serial.println("connection lost, reconnect...");
        if (timer >= 5000) {
            microgear.connect(APPID);
            timer = 0;
        }
        else timer += 100;
    }  
   // Serial.println(stm32Serial.available());
  if(stm32Serial.available()){
    String tmp =  stm32Serial.readStringUntil('.');
    String msg = Serial.readString();
          //Serial.println(tmp.length());
          if(tmp != ""){
              Serial.println(tmp);
             microgear.chat("Backend" ,tmp);
              //Serial.println("Success");
          }

          if(msg != ""){
            if(msg.equals("feed\n")){
              stm32Serial.write("1      ");
            }
            else if(msg.equals("reset\n")){
              char message[256];
              sprintf(message, "2 %d %d", maxFeed, foodPerFeed);
              Serial.println(message);
              stm32Serial.write(message);
            }
            else{
              stm32Serial.write("0");
            }
            Serial.println("Send complete");
            //stm32Serial.write(msg);
          }
  }
}
