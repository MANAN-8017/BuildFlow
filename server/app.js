const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("BuildFlow Is Online!");
});

module.exports = app;