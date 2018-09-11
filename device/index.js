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
            uuid: "00000001",
            major: 0,                             
            minor: 0,                            
            measuredPower: 0,                      
            rssi: -255,                               
            accuracy: 4.081852517778045,             
            proximity: "far",         
            temperature: getTemperature(),
            humidity: getHumidity(),
            lux: getLux()
        }));
        console.log('sending message to cloud -->');
        client.sendEvent(message, (err, res) => {
            if (err) console.log(err);
        });
    }, 5000);
});

var baseHumidity = 60;
var baseTemp = 23;
var baseLux = 111;


function getTemperature() {
    return baseTemp + getRandomNumber(0, 3) + getRandomNumber(1, 20) / 10;
}
function getHumidity() {
    return baseHumidity + getRandomNumber(0, 1) + getRandomNumber(1, 20) / 10;
}

function getLux() {
    return baseLux + getRandomNumber(0, 5) + getRandomNumber(1, 20) / 10;
}


function getRandomNumber(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}
