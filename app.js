const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const cors = require("cors");
const poll = require("./routes/poll.js");
// db config
require("./config/db");

const app = express();

// set the public floder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Enable cors
app.use(cors());
app.use("/poll", poll);

app.listen(3000, () => {
  console.log("server started");
});
