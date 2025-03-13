// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:

// const newBook = {
//   title: "Lean In",
//   author: "Sheryl Sandberg",
//   publishedYear: 2012,
//   genre: ["Non-fiction", "Business"],
//   language: "English",
//   country: "United States",
//   rating: 4.1,
//   summary:
//     "A book about empowering women in the workplace and achieving leadership roles.",
//   coverImageUrl: "https://example.com/lean_in.jpg",
// };

// 1.First Create the mongoose Schema of book and export it.
// 2.secondly, we create the data bse file. db.connect.js where we require mongoose and dotenv to connect to database. and then export initializeDatabase
// 3.Install experess and require it in index.js file. get initializeDatabase file and Book Schema in Index.js.
// 4. Create the express route to add books
//Test with Postman.

const express = require("express");
const cors = require("cors");
app.use(cors());
const app = express();
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");

initializeDatabase();

const newBook = {
  title: "Lean In",
  author: "Sheryl Sandberg",
  publishedYear: 2012,
  genre: ["Non-fiction", "Business"],
  language: "English",
  country: "United States",
  rating: 4.1,
  summary:
    "A book about empowering women in the workplace and achieving leadership roles.",
  coverImageUrl: "https://example.com/lean_in.jpg",
};

// CreateBook Function below.
const createBook = async (newBook) => {
  try {
    const book = new Book(newBook);
    const saveBook = await book.save();
    console.log("New Book Data.", saveBook);
    return saveBook;
  } catch (error) {
    console.log("There was an error.", error);
  }
};
// createBook(newBook);

// Express route to add Books.
app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res
      .status(201)
      .json({ message: "Book Added Successfully.", book: savedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Book" });
  }
});

// 3. Create an API to get all the books in the database as response. Make sure to do error handling.
// function that fetches all books from the database using Mongoose.
const readAllBooks = async () => {
  try {
    // Book.find() → Queries the MongoDB database to get all book records.
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    console.log(error);
  }
};
// API Route.
// Express route that serves the list of books when users hit GET /books.
app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length != 0) {
      res.json(books); //If books exist, it returns them as a JSON response.
    } else {
      res.status(400).json({ error: "No Books Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books data." });
  }
});

// 4. Create an API to get a book's detail by its title. Make sure to do error handling.
const readBooksByTitle = async (bookTitle) => {
  try {
    const book = await Book.find({ title: bookTitle });
    return book;
  } catch (error) {
    console.log(error);
  }
};
//express route below
app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBooksByTitle(req.params.bookTitle);
    if (book.length != 0) {
      res.json(book);
    } else {
      res.status(400).json({ error: "Book Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Data." });
  }
});

// 5. Create an API to get details of all the books by an author. Make sure to do error handling.
const readBooksByAuthor = async (bookAuthor) => {
  try {
    const book = await Book.find({ author: bookAuthor });
    return book;
  } catch (error) {
    console.log(error);
  }
};
app.get("/books/author/:bookAuthor", async (req, res) => {
  try {
    const book = await readBooksByAuthor(req.params.bookAuthor);
    if (book.length != 0) {
      res.json(book);
    } else {
      res.status(400).json({ error: "Book Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Book." });
  }
});

// 6. Create an API to get all the books which are of "Business" genre.
const readBooksBusiness = async (bookGenre) => {
  try {
    const books = await Book.find({ genre: { $in: [bookGenre] } });
    return books;
  } catch (error) {
    console.log(error);
  }
};
app.get("/books/genre/:bookGenre", async (req, res) => {
  try {
    const books = await readBooksBusiness(req.params.bookGenre);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(400).json({ error: "Book Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not fetch Book." });
  }
});

// 7. Create an API to get all the books which was released in the year 2012.
const readBooksByYear = async (bookYear) => {
  try {
    const books = await Book.find({ publishedYear: bookYear });
    return books;
  } catch (error) {
    console.log(error);
  }
};
app.get("/books/year/:bookYear", async (req, res) => {
  try {
    const books = await readBooksByYear(req.params.bookYear);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(401).json({ error: "Failed to find Book." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.
const updateBookData = async (bookId, bookRatingToUpdate) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      bookRatingToUpdate,
      { new: true }
    );
    return updatedBook;
  } catch (error) {
    console.log("Error in updating Book.", error);
  }
};
app.post("/books/rating/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookData(req.params.bookId, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book Updated Successfully",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book." });
  }
});

// Updated book rating: { "rating": 4.5 }

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.
const updateBookDataByTitle = async (bookTitle, newRating) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle }, //Find By TItle
      newRating, // update  rating
      { new: true }
    );
    return updatedBook;
  } catch (error) {
    console.log("Error Updating Book.", error);
  }
};
app.post("/books/rating/rating/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookDataByTitle(
      req.params.bookTitle,
      req.body
    );
    if (updatedBook) {
      res.status(200).json({
        message: "Book Updated successfully",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "BOok Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book." });
  }
});

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.
const deleteBook = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.log(error);
  }
};
app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({
        message: "Book Deleted Succesffully.",
        book: deletedBook,
      });
    } else {
      res.status(404).json({ error: "Book Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Book." });
  }
});

// Created Port 3000 using express to view on POSTMAN and Local.
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on , ", PORT);
});
