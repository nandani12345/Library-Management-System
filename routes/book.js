const router = require("express").Router();
const User = require("../modals/user");
const jwt = require("jsonwebtoken");
const Book = require("../modals/book");
const { authenticateToken } = require("./userAuth");

//add book-admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (user.role !== "admin") {
      return res
        .status(400)
        .send({ message: "You don't have permission to perform this action" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      desc: req.body.desc,
      price: req.body.price,
      language: req.body.language,
    });
    await book.save();
    res.status(200).send({ message: "Book added successfully..." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//update-book

router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      desc: req.body.desc,
      price: req.body.price,
      language: req.body.language,
    });
    res.status(200).send({ message: "Book updated successfully..." });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

//book-delete

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    res.status(200).send({ message: "Book deleted successfully..." });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

//get all book

router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).send({
      status: "Success",
      data: books,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred..." });
  }
});

//get-recently-added-book limit -4
router.get("/get-recent-book", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).send({
      status: "Success",
      data: books,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred..." });
  }
});

//get-recently-added-book limit -4
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.status(200).send({ status: "Success", data: book });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred..." });
  }
});


module.exports = router;
