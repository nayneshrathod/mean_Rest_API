const express = require('express');
const morgan = require("morgan");
const createHttp = require("http-errors");
require('dotenv').config()
require('./helpers/init_mongodb');
require('./helpers/init_redis');
const AuthRoute = require('./Routes/Auth.route')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const PORT = process.env.PORT || 3000;
// const client = require('./helpers/init_redis');

const app = express();
// client.SET("Nano", "Naynesh")
// client.GET("Nano", (err, value) => { if (err) console.log(err); console.log(value); })

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send("Index Main Router")
})

app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
    next(createHttp.NotFound())

})


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        },
    })
})


// app.use(async (req, res, next) => {
// const error = new Error("Not Found");
// error.status = 404
// next(error)
// })

app.listen(PORT, () => {
    console.log(`Server Running http://localhost:${PORT}/`);
})












































// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// let PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.DB_URL, {
//     dbName: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     pass: process.env.DB_PASSWORD,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: true,
//     useCreateIndex: true,
// }).then(() => console.log("mongo Connect")).catch(err => console.log(err));


// const uroot = require("./routers/User.router");
// app.use('', uroot);


// app.listen(PORT, () => {
//     console.log(`Server Running http://localhost:${PORT}/`);
// })



/*

// npm install express dotenv brcypt mongoose redis morgan jsonwebtoken http-errors  --save

echo "# mean_Rest_API" >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/nayneshrathod/mean_Rest_API.git
git push -u origin main
=================================

$ heroku login
Create a new Git repository
Initialize a git repository in a new or existing directory

$ cd my-project/
$ git init
$ heroku git:remote -a goesl
Deploy your application
Commit your code to the repository and deploy it to Heroku using Git.

git add .
git commit -am "make it better"
git push heroku master


*/