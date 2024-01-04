const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");

router.post("/:commentId/vote", verifyJWT, voteController.postVote);

module.exports = router;
