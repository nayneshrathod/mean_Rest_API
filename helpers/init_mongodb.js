const mongoose = require("mongoose");

// cluster0-shard-00-01.7uohl.mongodb.net:27017
// mongodb+srv://Raghunath:<password>@cluster0-shard-00-01.7uohl.mongodb.net:27017/myFirstDatabase?retryWrites=true&w=majority
// const uri = "mongodb://Raghunath:RAthod@cluster0-shard-00-01.7uohl.mongodb.net:27017/myFirstDatabase?retryWrites=true&w=majority"

// const uri = "mongodb://Raghunath:RAthod@cluster0-shard-00-00.7uohl.mongodb.net:27017,cluster0-shard-00-01.7uohl.mongodb.net:27017,cluster0-shard-00-02.7uohl.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"

// const uri = "mongodb://Raghunath:RAthod@cluster0-shard-00-00.7uohl.mongodb.net:27017/MyDB?ssl=true&replicaSet=cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
// mongoose.connect(uri, {
    // dbName: process.env.DB_NAME,
    // user: process.env.DB_USER,
    // pass: process.env.DB_PASSWORD,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
// }).then(() => console.log("MongoDB Connect TO Atalast")).catch(err => console.log(err.message));



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://NayneshRathod:Rathod1590@nayneshclusstername.7uohl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



// mongoose.connect('mongodb://localhost:27017/', {
//     dbName: "auth_tutorial", 
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
// }).then(() => console.log("MongoDB Connect TO Local")).catch(err => console.log(err));


mongoose.connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => console.log("MongoDB Connect TO Atalast")).catch(err => console.log(err.message));


mongoose.connection.on('connected', () => {
    console.log("Mongoose Connection is connected");
});
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});
mongoose.connection.on('disconnected', () => {
    console.log("Mongoose Connection is disconnected");
});
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})




// mongodb://Raghunath:RAthod@cluster0-shard-00-00.7uohl.mongodb.net:27017,cluster0-shard-00-01.7uohl.mongodb.net:27017,cluster0-shard-00-02.7uohl.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=cluster0-shard-0&authSource=admin&retryWrites=true&w=majority

// mongodb://<username>:<password>@
// clustermasjeed1-shard-00-00-ekpfe.mongodb.net:27017,
// clustermasjeed1-shard-00-01-ekpfe.mongodb.net:27017,
// clustermasjeed1-shard-00-02-ekpfe.mongodb.net:27017/
// test?
// ssl=true
// &replicaSet=ClusterMasjeed1-shard-0
// &authSource=admin
// &retryWrites=true
