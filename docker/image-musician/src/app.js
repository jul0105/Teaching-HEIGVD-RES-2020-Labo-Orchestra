console.log("My instrument is " + process.argv[2]);

const MULTICAST_GROUP = "239.255.123.12";

const dgram = require("dgram");
const client = dgram.createSocket("udp4");

client.on("error", (err) => {
    console.log(`client error:\n${err.stack}`);
    client.close();
});

client.bind(3778, () => {
    setInterval(playInstrument, 1000);
});

function playInstrument() {
    client.send(Buffer.from("ti-ta-ti"), 3778, MULTICAST_GROUP);
}

process.on("SIGINT", function () {
    process.exit();
});
