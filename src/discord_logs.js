const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const axios = require("axios");
const readline = require("readline");
const config = require("../config.json");

// Configurar la conexión serie con el Arduino
const port = new SerialPort({ path: "COM4", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// URL de la webhook de Discord
const webhookURL = config.webhook_url;

// Configurar la entrada de la consola para leer las teclas presionadas
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

rl.prompt();

rl.on("line", (input) => {
  if (input.trim() === "") {
    port.write("read\n", (err) => {
      if (err) {
        return console.log("Err in serial port:", err.message);
      }
    });
  }
  rl.prompt();
});

parser.on("data", async (data) => {
  console.log(data);
  const temperature = data.match(/Temperature: (\d+\.\d+)/);
  if (temperature) {
    const embed = {
      title: "> Internal Temperature Report!",
      description:
        ":thermometer: New **internal temperature** report from the Arduino UNO R3 Board",
      color: 0xff0000, // Color del borde del embed
      fields: [
        {
          name: "Temperature",
          value: `${temperature[1]} °C`,
          inline: true,
        },
      ],
      author: {
        name: "Arduino UNO R3",
        icon_url: "https://i.ibb.co/tbTwmKn/71z22c-RPee-L-1-modified.png",
      },
      image: {
        url: "https://i.ibb.co/5n2cKcx/imagen-2024-06-09-200219905.png",
      },
      footer: {
        text: "Temperature Monitor",
        icon_url: "https://i.ibb.co/t8JyQZZ/istockphoto-1184482788-612x612.jpg", // URL del icono para el pie de página
      },
    };
    try {
      await axios.post(webhookURL, {
        embeds: [embed],
      });
    } catch (error) {
      console.error("Err in Discord:", error);
    }
  }
});
