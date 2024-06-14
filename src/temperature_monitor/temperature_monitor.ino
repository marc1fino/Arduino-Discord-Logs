void setup() {
  Serial.begin(9600); // Inicializa la comunicación serie a 9600 baudios
  Serial.println("Basic Temperature Monitor");
  Serial.println("Press enter to get the internal temperature");
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n'); // Leer hasta el carácter de nueva línea

    if (msg == "read") {
      int sensorValue = analogRead(A0);
      float voltage = sensorValue * (5.0 / 1023.0);
      float temperatureC = (voltage - 0.5) * 100.0;
      String output = "Temperature: " + String(temperatureC) + "C";
      Serial.println(output);
      digitalWrite(LED_BUILTIN, HIGH); // Encender el LED
      delay(1000); // Mantener el LED encendido por 1 segundo
      digitalWrite(LED_BUILTIN, LOW); // Apagar el LED
    }
  }
}

