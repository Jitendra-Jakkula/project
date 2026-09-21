const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      required: true,
      trim: true,
    },

    problemId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    difficulty: {
      type: String,
      trim: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "not-started",
    },

    notes: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      }),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Problem", problemSchema);
