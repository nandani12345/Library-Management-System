const router = require("express").Router();
const User = require("../modals/user");
const { authenticateToken } = require("./userAuth");

// Add book to Favourite
router.put("/addFavourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Check if bookid and id are provided
    if (!bookid || !id) {
      return res
        .status(400)
        .send({ message: "Book ID and User ID are required" });
    }

    const userData = await User.findById(id);

    // Check if user exists
    if (!userData) {
      return res.status(404).send({ message: "User  not found" });
    }

    const isBookFavourites = userData.favourities.includes(bookid);

    if (isBookFavourites) {
      return res.status(200).send({ message: "Book already in favourites" });
    }

    // Use findByIdAndUpdate instead of findOneAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { favourities: bookid } },
      { new: true }
    );

    // Check if user was updated successfully
    if (!updatedUser) {
      return res.status(500).send({ message: "Failed to update user" });
    }

    return res.status(200).send({ message: "Book added to favourites" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//Delete-fav-book
router.put("/delete-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Check if bookid and id are provided
    if (!bookid || !id) {
      return res.status(400).send({ message: "bookid and id are required" });
    }

    const userData = await User.findById(id);

    // Check if user exists
    if (!userData) {
      return res.status(404).send({ message: "User  not found" });
    }

    const isBookFavourite = userData.favourities.includes(bookid);

    if (isBookFavourite) {
      await User.findByIdAndUpdate(id, { $pull: { favourities: bookid } });
      return res
        .status(200)
        .send({ message: "Favourite book removed successfully" });
    } else {
      return res.status(404).send({ message: "Book not found in favourites" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//get fav book by user
router.get("/getfav", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourities");
    const favouriteBook = userData.favourities; // Corrected the typo here
    return res.status(200).send({
      status: "Success", // Also corrected the typo here
      data: favouriteBook,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred..." });
  }
});

module.exports = router;
