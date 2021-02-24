/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./server.js
/*-!INFO!-*/


// -- !! -- //
const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const fs = require("fs");
const https = require("https");
const cors = require("cors");

const mongoose = require("mongoose");
const axios = require("axios");

const passport = require("./config/passport.config");
const mongodb = require("./config/mongodb.config");
const server = require("./config/server.config");

const rootRouter = require("./routes/root");
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const quizesRouter = require("./routes/quizes");
const tasksRouter = require("./routes/tasks");
const checkAnswersRouter = require("./routes/check-answers");

const {key} = require("./middlewares/api.mid");
// *- !! -* //


// Certificate
const domain = "---";
const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, "utf8");
const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, "utf8");
const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, "utf8");

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};


// User auth configuration
passport();

// Establishing a connection with a MongoDB - config file is based in ./config/ directory
mongoose.connect(mongodb.url, mongodb.options); 
mongoose.Promise = global.Promise;


mongoose.connection.once("open", () => {
    console.log("Succefully connected to the DB on address ", mongodb.url);
});
mongoose.connection.on("error", err => {
    console.log("Could not connect to the database on address ", mongodb.url);
    process.exit();
});


// The default server address can be changed in config file stored in ./config/ directory
axios.defaults.baseURL = server.address;


const app = express();
    app.use(cors({
        origin: [            
            `---`,
            `---`,

            `---`,
            `---`,
        ],
        methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        allowedHeaders: ["set-cookie", "Content-Type", "Accept", "Origin", "X-Requested-With", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
        credentials: true,
        exposedHeaders: ["set-cookie", "Content-Type", "Accept", "Origin", "X-Requested-With", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
        preflightContinue: true
    }));

    // app.use(cors());

    // app.use((req, res, next) => {
    //     res.append('Access-Control-Allow-Origin', ['---']);
    //     res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    //     res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //     res.append('Access-Control-Allow-Credentials', 'true');
    //     next();
    // });

    // app.use(cors());
    // app.use((req, res, next) => {        
    //     // res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    //     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     // next();

        // if(req.headers.origin === "---") res.header("Access-Control-Allow-Origin", "---");
        // if(req.headers.origin === "---") res.header("Access-Control-Allow-Origin", "---");
        
    //     // res.header('Access-Control-Allow-Credentials', true);
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS');

        // next();
    // });

    app.use(fileUpload());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false, limit: "4mb"}));

    app.use(session({
        secret: "863d55161e1e07e176505fec5c29f426",
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            maxAge: 60*30*100,
            secure: true
        }
    }));

    // Middleware that is used to create a routes to our API
    // It depends on routers in ./routes/ directory 
    app.use("/api", key, rootRouter);
    app.use("/api/users", key, usersRouter);
    app.use("/api/questions", key, questionsRouter);
    app.use("/api/quizes", key, quizesRouter);
    app.use("/api/tasks", key, tasksRouter);
    app.use("/api/answers", key, checkAnswersRouter);
    

    // HTTPS
    // Default port can be changed in config file stored in ./config/ directory
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(server.port, () => {
        console.log("HTTPS server is up and running on port", server.port);
    });
