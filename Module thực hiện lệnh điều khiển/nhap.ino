#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// wifi
const char* ssid = "Duong";
const char* passwordwf = "11111111";

// Thông tin Firebase
const char* FIREBASE_HOST = "https://bt-iot-7af8a-default-rtdb.asia-southeast1.firebasedatabase.app/";
const char* FIREBASE_AUTH = "i0SPueav25FRwD0lKD7BiQjGE9TVL9lVyhcuoDid";

Servo myServo;  // Khai báo đối tượng Servo

void setup() {
  Serial.begin(115200);
  Serial.println("test");
  myServo.attach(13);  // Gắn servo vào chân GPIO 13 (hoặc chân khác tùy vào kết nối của bạn)
  WiFi.begin(ssid, passwordwf);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

int prevStatus = -1;

void loop() {
  int status = getLEDStatus();
  if(prevStatus==-1){
    prevStatus = status;
  }
  if(status != prevStatus){
    if(status == 1){
      myServo.write(0);
    }else if(status == 0){
      myServo.write(180);
    }
    Serial.println(status);
    prevStatus = status;
  }
}

int getLEDStatus() {
  if (WiFi.status() == WL_CONNECTED) {  // Kiểm tra kết nối WiFi
    HTTPClient http;
    String url = String(FIREBASE_HOST) + "/LED.json?auth=" + FIREBASE_AUTH;
    http.begin(url.c_str());
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
      if (payload == "\"ON\"") {
        // digitalWrite(ledPin, HIGH);
        Serial.println("LED is ON");
        return 1;
      } else if (payload == "\"OFF\"") {
        // digitalWrite(ledPin, LOW);
        Serial.println("LED is OFF");
        return 0;
      }
    } else {
      Serial.printf("GET request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
  return 0;
}
