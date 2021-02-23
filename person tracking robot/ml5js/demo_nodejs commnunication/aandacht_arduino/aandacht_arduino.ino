#define BUZZER_PIN 9
void setup()
{
  Serial.begin(9600);   //send and receive at 9600 baud
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
}

String inData = "";
void loop()
{
  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);
    //digitalWrite(BUZZER_PIN, HIGH);
    // Process message when new line character is received
    if (received == '\n') {
      if (inData == "kaas\n") {
        inData = "";
        digitalWrite(BUZZER_PIN, HIGH);
      }else{
        digitalWrite(BUZZER_PIN, LOW);
      }
    }
  }

}
