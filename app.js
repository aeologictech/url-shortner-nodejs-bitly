const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const createHttpError = require("http-errors");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
const axios = require("axios");
var request = require("request");
app.get("/", async (req, res, next) => {
  res.render("index", { error: "", data: "" });
});

app.post("/", async (req, res) => {
  if (!req.body.url) {
    return res.render("index", { error: "Please enter url", data: "" });
  }
  try {
    const token = process.env.BITLY_ACCESS_TOKEN;
    let headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    var dataString = `{ "long_url": "${req.body.url}"}`;

    const api_url = "https://api-ssl.bitly.com/v4/shorten";
    var options = {
      url: api_url,
      method: "POST",
      headers: headers,
      body: dataString,
    };

    request(options, (error, body) => {
      if (error) {
        return res.status(404).send(error);
      }
      return res.render("index", { error: "", data: JSON.parse(body.body) });
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`server is up & running on port : ${PORT}`));
