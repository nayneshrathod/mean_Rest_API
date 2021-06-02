const redis = require("redis");
const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})
client.on('connect', () => {
    console.log("client Connection is connected");
});
client.on('ready', (err) => {
    console.log("client  is connected and ready to use");
});
client.on('error', (err) => {
    console.log(err.message);
});
client.on('end', () => {
    console.log("client Connection is disconnected");
});
process.on('SIGINT', () => {
    // await client.connection.close()
    client.quit()
})

module.exports = client