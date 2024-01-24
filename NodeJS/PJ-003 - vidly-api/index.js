const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const Joi = require("joi");
const pug = require("pug");
const port = process.env.PORT || 3000;
const home = require("./routes/home");
const genres = require("./routes/genres");
const morgan = require("morgan");
const debugStart = require("debug")("app:startup");

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debugStart("morgan pkg enabled");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "pug");
app.use("/api/v1/genres", genres);
app.use("/", home);

//app.use("/", (req, res) => {
//  console.log("Hello World");
//});
app.listen(port, () => {
  debugStart(
    `Server running: \n${process.env.NODE_ENV.toUpperCase()} (${port})`
  );
});
