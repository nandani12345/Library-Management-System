const router = require("express").Router();
const User = require("../modals/user");
const { authenticateToken } = require("./userAuth");

//add cart
router.put("/add-cart-to", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    // Check if required headers are present
    if (!bookid || !id) {
      return res.status(400).send({
        status: "Failed",
        message: "Book ID and User ID are required",
      });
    }
    // Check if user exists
    if (!userData) {
      return res.status(404).send({
        status: "Failed",
        message: "User  not found",
      });
    }
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.send({
        status: "Success",
        message: "Book is already in your cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });
    return res.send({
      status: "Success",
      message: "Book added to cart successfully",
    });
  } catch {
    res.status(500).send({ status: "Failed", message: "Failed to add book" });
  }
});

//Remove in cart
router.put("/remove-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.send({
      status: "Success",
      message: "Book removed from cart successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//get-user-cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.send({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});
module.exports = router;
