// =============
// == Auditor ==
// =============

const net = require("net");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const MULTICAST_GROUP = "239.255.123.12";
const PORT = 3778;

let musicians = [];

const server = net.createServer((c) => {
    console.log("Client connected");
    setInterval(() => {
        c.write(Buffer.from(JSON.stringify(musicians, null, 4) + "\n"));
    }, 5000);
    c.on("end", () => {
        console.log("Client disconnected");
    });
});

server.on("listening", () => {
    console.log("Auditor server is listening on port 2205.");
});

server.listen(2205);

console.log("My instrument is " + process.argv[2]);

client.on("error", (err) => {
    console.log(`client error:\n${err.stack}`);
    client.close();
});

client.on("message", (msg, rinfo) => {
    const json = JSON.parse(msg);
    const id = json.musician_id;

    const instrument = ((sound) => {
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
    })(json.sound);

    const obj = {
        "uuid": id,
        "instrument": instrument,
        "activeSince": new Date()
    };

    const index = musicians.findIndex(m => {
        return m.uuid === id;
    });
    if (index === -1) {
        musicians.push(obj);
    } else {
        musicians[index] = obj;
    }
    console.log(id + " plays " + instrument);
});

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

setInterval(() => {
    date = new Date();
    musicians = musicians.filter(m => {
        return (date - m.activeSince) / 1000 <= 5;
    })
    console.log('Checking for active musician...')
}, 5000)

process.on("SIGINT", function () {
    process.exit();
});
