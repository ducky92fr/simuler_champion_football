const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const leagueRoute = require("./routes/league");
const matchRoute = require("./routes/match");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-owbdv.mongodb.net/${
  process.env.MONGO_DEFAULT_DATABASE
}?retryWrites=true`;

const app = express();

//Routes

app.use(bodyParser.json()); //for application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/league", leagueRoute);
app.use("/api/match", matchRoute);

//Mongoose
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log("err");
  });
