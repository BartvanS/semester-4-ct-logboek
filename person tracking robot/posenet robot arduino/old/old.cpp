for (byte i = 0; i < charCount; i++)
			{
				s = Serial.read();
				command[i] = s;
			}
			command[charCount + 1] = '\0';

			String leftShoulderReceived = "\0";
			if (command[3] != 'x')
			{
				leftShoulderReceived.concat(command[3]);
			}
			if (command[4] != 'x')
			{
				leftShoulderReceived.concat(command[4]);
			}
			if (command[5] != 'x')
			{
				leftShoulderReceived.concat(command[5]);
			}
			int leftShoulderReceivedInt = leftShoulderReceived.toInt();