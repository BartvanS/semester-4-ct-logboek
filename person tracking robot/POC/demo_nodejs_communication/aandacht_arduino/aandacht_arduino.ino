#define BUZZER_PIN 9
void setup()
{
  Serial.begin(9600);   //send and receive at 9600 baud
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
}
String txtMsg = "";
//#define numberOfBytes 5
//char command[numberOfBytes];
char s;
void loop()
{
  while (Serial.available() > 0) {
    s = (char)Serial.read();
    Serial.print("wow");
    if (s == '\n') {
      if (txtMsg == "HIGH") {
        digitalWrite(BUZZER_PIN, HIGH);
      }
      if (txtMsg == "LOW")  {
        digitalWrite(BUZZER_PIN, LOW);
      }
      // Serial.println(txtMsg);
      txtMsg = "";
    } else {
      txtMsg += s;
    }
  }
}
