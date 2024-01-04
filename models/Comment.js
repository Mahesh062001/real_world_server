const mongoose = require("mongoose");
const User = require("./User");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    votes: { type: Number, default: 0 },
    votedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        voteType: { type: String, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.methods.toCommentResponse = async function (user) {
  const authorObj = await User.findById(this.author).exec();
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: authorObj.toProfileJSON(user),
  };
};

module.exports = mongoose.model("Comment", commentSchema);
