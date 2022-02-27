const express = require("express");
const router = express.Router();
const Pusher = require("pusher");
const mongoose = require("mongoose");
const Vote = require("../models/Vote");

const pusher = new Pusher({
  appId: "1348555",
  key: "69b17460791d8d78e553",
  secret: "cc751bf103f66c422487",
  cluster: "ap2",
  useTLS: true,
});

router.get("/", (req, res) => {
  Vote.find().then((votes) => {
    res.json({ success: true, votes: votes });
  });
});

router.post("/", (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1,
  };
  new Vote(newVote).save().then((vote) => {
    // trigger pusher
    pusher.trigger("os-poll", "os-vote", {
      points: parseInt(vote.points),
      os: vote.os,
    });

    return res.json({ success: true, message: "Thank You for voting" });
  });
});

module.exports = router;
