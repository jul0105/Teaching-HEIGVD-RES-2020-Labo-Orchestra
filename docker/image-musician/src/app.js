// ==============
// == Musician ==
// ==============

const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const { v4 } = require("uuid");

const MULTICAST_GROUP = "239.255.123.12";
const PORT = 3778;

const id = v4();

console.log("My instrument is " + process.argv[2]);

const getSound = (instrument) => {
    switch (instrument) {
        case "piano":
            return "ti-ta-ti";
        case "trumpet":
            return "pouet";
        case "flute":
            return "trulu";
        case "violin":
            return "gzi-gzi";
        case "drum":
            return "boum-boum";
    }
}

const playInstrument = () => {
    let message = {
        musician_id: id,
        sound: getSound(process.argv[2]),
    };
    client.send(Buffer.from(JSON.stringify(message)), PORT, MULTICAST_GROUP);
}

// Envoie chaque seconde le son ainsi que l'id du musicien
setInterval(playInstrument, 1000);

// Facilite la fermeture de l'app via Docker
process.on("SIGINT", () => {
    process.exit();
});

process.on("SIGTERM", () => {
    process.exit();
});
