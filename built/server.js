require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var connectDB = require("./models/index.js").connectDB;
var _a = require("./routes/router.js"), songsRoute = _a.songsRoute, usersRoute = _a.usersRoute, ytSearchRoute = _a.ytSearchRoute, playlistRoute = _a.playlistRoute;
var jwt = require("jsonwebtoken");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost/", "http://127.0.0.1/"],
    credentials: true,
}));
var authJWT = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        var token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, user) {
            if (err) {
                console.log(err);
                return res.sendStatus(403); //403 == forbidden
            }
            console.log("user authorized: ".concat(user.userName));
            req.user = user;
            next();
        });
    }
    else {
        console.log("no authHeader");
        return res.sendStatus(401);
    }
};
var port = process.env.PORT || 1251;
connectDB().then(function () {
    console.log("connected to DB successfuly");
});
app.use("/songs", authJWT, songsRoute);
app.use("/users", usersRoute);
app.use("/ytsearch", ytSearchRoute);
app.use("/playlist", authJWT, playlistRoute);
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
