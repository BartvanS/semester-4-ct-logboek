#define BUZZER_PIN 9

#define SERVO_ONE 10
#include <Servo.h>
Servo myservo;
void setup()
{
  myservo.attach(SERVO_ONE);

  Serial.begin(9600);   //send and receive at 9600 baud
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
  myservo.write(0);
}
//String txtMsg = "";

const int charCount = 6;
char command[charCount];
char s;

int pos = 0;
void loop()
{
  while (Serial.available() > charCount) {
    s = Serial.read();
    //    Serial.print(s);
    if (s == '#') {
      for (byte i = 0; i < charCount; i++) {
        s = Serial.read();
        command[i] = s;
      }
      command[charCount + 1] = '\0';

      String leftShoulderReceived = "\0";
      if (command[3] != 'x') {
        leftShoulderReceived.concat(command[3]);
      }
      if (command[4] != 'x') {
        leftShoulderReceived.concat(command[4]);
      }
      if (command[5] != 'x') {
        leftShoulderReceived.concat(command[5]);
      }
      int leftShoulderReceivedInt = leftShoulderReceived.toInt();
      //!! serial.print crashes the arduino 🤷‍
//      Serial.println(leftShoulderReceivedInt);
      myservo.write(leftShoulderReceivedInt);
    }
  }
}
