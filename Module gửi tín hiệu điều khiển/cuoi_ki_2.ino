#include <Keypad.h>
#include <ESP32Servo.h>
#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
// #include <NTPClient.h>
// #include <WiFiUdp.h>
// #include <TimeLib.h>

// wifi
const char* ssid = "Duong";
const char* passwordwf = "11111111";

// Thông tin Firebase
const char* FIREBASE_HOST = "https://bt-iot-7af8a-default-rtdb.asia-southeast1.firebasedatabase.app/";
const char* FIREBASE_AUTH = "i0SPueav25FRwD0lKD7BiQjGE9TVL9lVyhcuoDid";


const byte ROWS = 4;  // số hàng của bàn phím
const byte COLS = 4;  // số cột của bàn phím

#define LIMIT_SWITCH_PIN 23

int lcdColumns = 16;
int lcdRows = 2;

LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

// Định nghĩa các chân của bàn phím
char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};

byte rowPins[ROWS] = { 14, 27, 26, 25 };  // Sử dụng các chân GPIO khác
byte colPins[COLS] = { 33, 32, 18, 19 };  // Sử dụng các chân GPIO khác
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

Servo myServo;
const int servoPin = 4;   // chân kết nối servo
const int buzzerPin = 4;  // chân kết nối buzzer
// const int switchPin = 34;

// String password = "1245";  // mật khẩu đúng
String inputPassword = "";
bool isEnteringPassword = false;
int prevSwitchState = -1;
int count = 0;

// WiFiUDP udp;
// Khởi tạo đối tượng NTPClient
// NTPClient timeClient(udp, "pool.ntp.org", 25200);

void setup() {
  Serial.begin(115200);
  // Bắt đầu NTPClient
  // timeClient.begin();
  myServo.attach(servoPin);
  // Kết nối WiFi
  WiFi.begin(ssid, passwordwf);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  pinMode(buzzerPin, OUTPUT);
  pinMode(LIMIT_SWITCH_PIN, INPUT_PULLDOWN);

  // Khởi tạo LCD
  lcd.init();
  // Bật đèn nền LCD
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Nhan A de nhap");
}

void loop() {
  // handleTime();
  int switchState = digitalRead(LIMIT_SWITCH_PIN);
  if (prevSwitchState == -1) {
    prevSwitchState = switchState;
  }
  Serial.println(switchState);

  if (switchState == 1) {
    if (prevSwitchState != switchState) {
      prevSwitchState = switchState;
      // delay(500);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Khoa cua ...");
      updateLEDStatus("OFF");
      tone(buzzerPin, 3000, 300);
      tone(buzzerPin, 3000, 600);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Nhan A de nhap:");
    }
  }
  char key = keypad.getKey();

  if (key) {
    tone(buzzerPin, 3000, 100);  // bật buzzer mỗi lần nhấn phím
    Serial.println(key);

    if (key == 'A') {
      if (switchState == 0) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Cua dang mo");
        delay(500);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Nhan A de nhap:");
        return;
      }
      Serial.println(switchState);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Nhap mat khau:");
      isEnteringPassword = true;
      inputPassword = "";
      Serial.println("Start entering password");
    } else if (key == 'C') {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Huy....");
      delay(500);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Nhan A de nhap");
      isEnteringPassword = false;
      inputPassword = "";
      Serial.println("Cancelled");
    } else if (isEnteringPassword) {
      inputPassword += key;
      // lcd.clear();
      lcd.setCursor(count, 1);
      lcd.print(key);
      count++;
      // Kiểm tra khi người dùng nhập đủ độ dài mật khẩu
      if (inputPassword.length() == 4) {
        // handleTime();
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Loading ...");
        String password = getPassword();
        String passwordTmp = getPasswordTmp();
        passwordTmp = passwordTmp.substring(1, 5);
        password = password.substring(1, 5);
        Serial.print("Password cloud: ");
        Serial.println(password);
        Serial.print("Password cloud tmp: ");
        Serial.println(passwordTmp);
        Serial.print("Password: ");
        Serial.println(inputPassword);
        if (inputPassword == password || inputPassword == passwordTmp) {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Thanh Cong...");
          prevSwitchState = 0;
          updateLEDStatus("ON");
          delay(5000);
          switchState = digitalRead(LIMIT_SWITCH_PIN);
          if (switchState == 1) {
            Serial.print("state");
            Serial.print(switchState);
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Khoa cua ...");
            updateLEDStatus("OFF");
            tone(buzzerPin, 3000, 300);
            tone(buzzerPin, 3000, 600);
          }
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Nhan A de nhap");
          Serial.println("Access Granted");
          tone(4, 3000, 1000);
          Serial.println("Access Granted");

        } else {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("That Bai");
          delay(500);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Nhan A de nhap");
          Serial.println("Access Denied");
        }
        count = 0;
        inputPassword = "";          // reset mật khẩu nhập vào
        isEnteringPassword = false;  // kết thúc quá trình nhập mật khẩu
      }
    }
  }
  prevSwitchState = switchState;
}

String getPassword() {
  String payload = "";
  if (WiFi.status() == WL_CONNECTED) {  // Kiểm tra kết nối WiFi
    HTTPClient http;
    String url = String(FIREBASE_HOST) + "/PASSWORD.json?auth=" + FIREBASE_AUTH;
    http.begin(url.c_str());
    int httpCode = http.GET();

    if (httpCode > 0) {
      payload = http.getString();
      Serial.println(payload);

    } else {
      Serial.printf("GET request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
  return payload;
}
String getPasswordTmp() {
  String payload = "";
  if (WiFi.status() == WL_CONNECTED) {  // Kiểm tra kết nối WiFi
    HTTPClient http;
    String url = String(FIREBASE_HOST) + "/TMP_PASSWORD.json?auth=" + FIREBASE_AUTH;
    http.begin(url.c_str());
    int httpCode = http.GET();

    if (httpCode > 0) {
      payload = http.getString();
      Serial.println(payload);

    } else {
      Serial.printf("GET request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
  return payload;
}

void updateLEDStatus(const char* status) {
  if (WiFi.status() == WL_CONNECTED) {  // Kiểm tra kết nối WiFi
    HTTPClient http;
    String url = String(FIREBASE_HOST) + "/LED.json?auth=" + FIREBASE_AUTH;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.PUT(String("\"") + status + "\"");

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.printf("PUT request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
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

String getTime() {
  String payload = "";
  if (WiFi.status() == WL_CONNECTED) {  // Kiểm tra kết nối WiFi
    HTTPClient http;
    String url = String(FIREBASE_HOST) + "/TIME.json?auth=" + FIREBASE_AUTH;
    http.begin(url.c_str());
    int httpCode = http.GET();

    if (httpCode > 0) {
      payload = http.getString();
      Serial.println(payload);

    } else {
      Serial.printf("GET request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
  return payload;
}

// void handleTime() {
//   String data = getTime();
//   timeClient.update();  // Cập nhật thời gian
//   // Lấy thời gian từ NTP và gán cho các biến
//   unsigned long epochTime = timeClient.getEpochTime();  // Lấy thời gian epoch

//   // Cập nhật thời gian cho thư viện TimeLib
//   setTime(epochTime);
//   int dayCurrent = String(day()).toInt();
//   int monthCurrent = String(month()).toInt();
//   int yearCurrent = String(year()).toInt();
//   int hourCurrent = String(hour()).toInt();
//   int minuteCurrent = String(minute()).toInt();

//   int day = data.substring(1,3).toInt();
//   int month = data.substring(4,6).toInt();
//   int year = data.substring(7,11).toInt();
//   int hour = data.substring(12,14).toInt();
//   int minute = data.substring(15).toInt();

//   Serial.println(day);
//   Serial.println(month);
//   Serial.println(year);
//   Serial.println(hour);
//   Serial.println(minute);

// }