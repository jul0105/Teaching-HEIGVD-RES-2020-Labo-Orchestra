// ==============
// == Musician ==
// ==============

const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const { v4 } = require('uuid');

const MULTICAST_GROUP = "239.255.123.12";
const PORT = 3778;

const id = v4();

console.log("My instrument is " + process.argv[2]);

client.on("error", (err) => {
    console.log(`client error:\n${err.stack}`);
    client.close();
});

client.bind(PORT, () => {
    setInterval(playInstrument, 1000);
});

function playInstrument() {
    let message = {
        musician_id: id,
        sound: "ti-ta-ti"
    };
    client.send(Buffer.from(JSON.stringify(message)), PORT, MULTICAST_GROUP);
}

process.on("SIGINT", function () {
    process.exit();
});
