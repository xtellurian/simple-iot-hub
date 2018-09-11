let deviceAmqp = require('azure-iot-device-amqp');
let device = require('azure-iot-device');

require('dotenv').config();
let client = deviceAmqp.clientFromConnectionString(process.env.DEVICE_CONNECTION_STRING);

client.open(err => {
    let deviceName = 'simdevice1';
    console.log(`acting as ${deviceName}`);

    //handle C2D messages
    client.on('message', msg => {
        client.complete(msg, () => console.log('<-- cloud message received'));
    });

    // send a D2C message repeatedly
    setInterval(function () {
        let message = new device.Message(JSON.stringify({
            simulated: true,
            deviceId: deviceName,
            temperature: getTemperature()
        }));
        console.log('sending message to cloud -->');
        client.sendEvent(message, (err, res) => {
            if (err) console.log(err);
        });
    }, 5000);
});

var baseTemp = 23;

function getTemperature() {
    return baseTemp + getRandomNumber(0, 3) + getRandomNumber(1, 20) / 10;
}

function getRandomNumber(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}
