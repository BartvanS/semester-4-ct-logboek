void setup()
{
  Serial.begin(9600);   //send and receive at 9600 baud
  pinMode(9, OUTPUT);
  digitalWrite(9, HIGH);
  delay(100);
  digitalWrite(9, LOW);
}

String inData = "";
void loop()
{

  //  digitalWrite(13, HIGH);
  //  delay(1000);
  //  digitalWrite(13, LOW);
  //  delay(1000);
  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);
    //digitalWrite(9, HIGH);
    // Process message when new line character is received
    if (received == '\n') {
      if (inData == "kaas\n") {
        inData = "";
        digitalWrite(9, HIGH);
      }else{
        digitalWrite(9, LOW);
      }
    }
  }

}
