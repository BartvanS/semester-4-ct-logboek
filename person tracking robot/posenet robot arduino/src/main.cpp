#include <Arduino.h>

#define BUZZER_PIN 8

#define SERVO_LEFT_SHOULDER_X 9
#define SERVO_LEFT_ELBOW 10
#include <Servo.h>
Servo servoLSX;
Servo servoLE;
void setup()
{
	servoLSX.attach(SERVO_LEFT_SHOULDER_X);
	servoLE.attach(SERVO_LEFT_ELBOW);
	Serial.begin(9600); //send and receive at 9600 baud
	pinMode(BUZZER_PIN, OUTPUT);
	digitalWrite(BUZZER_PIN, HIGH);
	delay(100);
	digitalWrite(BUZZER_PIN, LOW);
	servoLSX.write(0);
	servoLE.write(0);
}
const int charCount = 18;												//message where arm has 2 servos is 18 char long ("#xxx|xxx|xxx|xxx|%")
const int numberLenghtOfSingleValue = 4;								//amount of numbers as chars in a message + 1 for delimiter
const int amountOfValues = (charCount - 2) / numberLenghtOfSingleValue; // -2 as start and stop byte
char command[charCount];
char s;
//+1 for null terminator
char data[4][numberLenghtOfSingleValue + 1] = {
	{"\0"}, // left shoulder x
	{"\0"}, //left elbow
	{"\0"}, // right shoulder x
	{"\0"}	//right shoulder
};
int pos = 0;
void loop()
{
	//check if message as long as the estimated message length
	while (Serial.available() >= charCount)
	{
		s = Serial.read();
		if (s == '#')
		{
			for (byte i = 0; i < amountOfValues; i++) //-1 as we already have read the start char and dont want to do anything with the stopchar
			{
				int count = 0;
				for (byte j = 0; j < numberLenghtOfSingleValue; j++)
				{
					s = Serial.read();
					if (s != 'x')
					{
						data[i][count] = s;
						count++;
					}
				}
				data[i][count] = '\0';
			}

			for (byte i = 0; i < amountOfValues; i++) //-1 as we already have read the start char and dont want to do anything with the stopchar
			{
				int value = atoi(data[i]);
				//for prototype rightside is left
				if (i == 2)
				{
					servoLSX.write(value);
				}
				if (i == 3)
				{
					servoLE.write(value);
				}
			}
			//!! serial.print crashes the arduino 🤷‍
			// Serial.println(leftShoulderReceivedInt);
		}
	}
}