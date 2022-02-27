const mongoose = require("mongoose");

// map global promise

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://dbuser:dbuser@cluster0.hakag.mongodb.net/poling-app?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));
