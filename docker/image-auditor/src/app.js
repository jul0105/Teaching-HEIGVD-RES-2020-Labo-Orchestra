// =============
// == Auditor ==
// =============

const net = require("net");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const app = require("express")();

const MULTICAST_GROUP = "239.255.123.12";
const PORT = 3778;

let musicians = [];

// On crée le serveur TCP qui renvoie les musiciens actifs à chaque connexion
const server = net.createServer((c) => {
    c.write(Buffer.from(JSON.stringify(musicians, null, 4) + "\n"));
    c.destroy();
});

server.on("listening", () => {
    console.log("Auditor server is listening on port 2205.");
});

server.listen(2205);

// A chaque message UDP reçu sur le port 3778
client.on("message", (msg, rinfo) => {
    const json = JSON.parse(msg);
    const id = json.musician_id;
    const sound = json.sound;

    const instrument = getInstrument(sound);

    const obj = {
        uuid: id,
        instrument: instrument,
        activeSince: new Date(),
    };

    // On recherche dans le tableau si le musicien existe déjà
    const index = musicians.findIndex((m) => {
        return m.uuid === id;
    });

    // Si c'est un nouveau musicien, on le rajoute au tableau, sinon on le remplace
    if (index === -1) {
        musicians.push(obj);
    } else {
        musicians[index] = obj;
    }
    console.log(id + " plays " + instrument + " with sounds " + sound);
});

// Ecoute sur le port 3778 abonné au groupe multicast
client.bind(PORT, () => {
    client.addMembership(MULTICAST_GROUP);
    console.log(
        "Auditor is bound to " +
            PORT +
            " with " +
            MULTICAST_GROUP +
            " multicast group."
    );
});

// Permet de retrouver l'instrument à partir du son qu'il produit
const getInstrument = (sound) => {
    switch (sound) {
        case "ti-ta-ti":
            return "piano";
        case "pouet":
            return "trumpet";
        case "trulu":
            return "flute";
        case "gzi-gzi":
            return "violin";
        case "boum-boum":
            return "drum";
    }
};

// Actualise le tableau des musiciens actifs
setInterval(() => {
    date = new Date();
    musicians = musicians.filter((m) => {
        return (date - m.activeSince) / 1000 <= 5;
    });
}, 1000);

// On distribue le tableau des musicien via une API (bonus)
app.get("/api", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json(musicians);
});

app.listen(3030, () => {
    console.log("API server listening on port 3030");
});

// Facilite la fermeture de l'app via Docker
process.on("SIGINT", () => {
    process.exit();
});

process.on("SIGTERM", () => {
    process.exit();
});
