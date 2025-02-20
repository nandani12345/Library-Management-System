const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../modals/book");
const Order = require("../modals/order");
const User = require("../modals/user");

//place-order
router.post("/orderRecived", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming authenticateToken middleware sets req.user
    const { order } = req.body;

    if (!id) {
      return res.status(400).send({ message: "we dont recive id" });
    } else if (!order) {
      return res.status(400).send({ message: "we dont recive order" });
    }

    // Looping for the book-order
    for (const orderData of order) {
      if (!orderData._id) {
        return res.status(400).send({ message: "Invalid order data" });
      }

      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // Saving Order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // Clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).send({ message: "Internal server error" });
  }
});

// get orderDeatails(particular-user)
router.get("/get-Order-Details", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const orderData = userData.orders.reverse();
    return res.status(200).send({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//get all order details by -admin
router.get("/get-all-order-Details", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({
        createdAt: -1,
      });
    return res.status(200).send({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    return res.status(400).send({ message: "Internal server error" });
  }
});

//order-status-update
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    console.log("Order ID:", req.params.id);
    console.log("New status:", req.body.status);

    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res
      .status(200)
      .send({ message: "Order status updated successfully" });
  } catch (error) {
    return res.status(400).send({ message: "Internal server error" });
  }
});

module.exports = router;
