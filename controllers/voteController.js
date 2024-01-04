const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");

const postVote = asyncHandler(async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.userId;
    const voteType = req.body.voteType;

    const comment = await Comment.findOne({ commentId: commentId });

    let update;
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.votedUsers.some((user) => user.userId.equals(userId))) {
      if (voteType === comment.votedUsers[0].voteType) {
        const newVoteCount = voteType === "upVote" ? -1 : 1;
        // update = {
        //   $inc: { votes: newVoteCount },
        //   $set: { "votedUsers.$[elem].voteType": null },
        // };
        update = {
          $inc: { votes: newVoteCount },
          $pull: { votedUsers: { userId: userId } },
        };
      } else if (comment.votedUsers[0].voteType === null) {
        const newVoteCount = voteType === "upVote" ? 1 : -1;
        update = {
          $inc: { votes: newVoteCount },
          $set: { "votedUsers.$[elem].voteType": voteType },
        };
      } else {
        const newVoteCount = voteType === "upVote" ? 2 : -2;
        update = {
          $inc: { votes: newVoteCount },
          $set: { "votedUsers.$[elem].voteType": voteType },
        };
      }
    } else {
      if (voteType === "upVote") {
        update = {
          $inc: { votes: 1 },
          $push: { votedUsers: { userId: userId, voteType: voteType } },
        };
      } else if (voteType === "downVote") {
        update = {
          $inc: { votes: -1 },
          $push: { votedUsers: { userId: userId, voteType: voteType } },
        };
      } else {
        return res.status(400).json({ error: "Invalid vote type" });
      }
    }

    const options = {
      new: true,
      upsert: true,
      arrayFilters: [{ "elem.userId": userId }],
    };

    const updatedComment = await Comment.findOneAndUpdate(
      { commentId },
      update,
      options
    );

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  postVote,
};
