const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
    },
    genre: [
      {
        type: String,
      },
    ],
    language: {
      type: String,
    },
    country: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    summary: {
      type: String,
    },
    coverImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
