const net = require("net");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const MULTICAST_GROUP = "239.255.123.12";
const PORT = 3778;

const server = net.createServer((c) => {
    console.log("Client connected");
    c.write(Buffer.from("Hello from auditor"));
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
    console.log("Receive from musician : " + msg.toString());
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

process.on("SIGINT", function () {
    process.exit();
});
