const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./connection/config");
const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
app.use(cors());
app.use(express.json());

connection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server has started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // Exit the process if there's a connection error
  });

app.use("/", User);
app.use("/", Books);
app.use("/", Favourite);
app.use("/", Cart);
app.use("/", Order);
