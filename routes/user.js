const router = require("express").Router();
const User = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth")

// SignUp //Registration

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check username length is more than 4
    if (username.length < 4) {
      return res
        .status(400)
        .send({ message: "Username must be more than 4 characters" });
    }

    // Check username already exists
    const existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ message: "Username already exists" });
    }

    // Check email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Check password length
    if (password.length < 5) {
      return res
        .status(400)
        .send({ message: "Password must be more than 5 characters" });
    }

    //hashing the password
    const hashPass = await bcrypt.hash(password, 7);
    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });
    await newUser.save();
    res.status(200).send({ message: "Signup successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

//Signup //Login

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existUser = await User.findOne({ username });
    if (!existUser) {
      return res.status(400).send({ message: "Invalid credential" });
    }
    await bcrypt.compare(password, existUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: "existUser.username" },
          { role: "existUser.role" },
        ];
        const token = jwt.sign({ authClaims }, "bookStore123", {
          expiresIn: "2d",
        });
        return res
          .status(200)
          .send({ id: existUser._id, role: existUser.role, token: token });
      } else {
        return res.status(400).send({ message: "Invalid credential" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//get - user-information

router.get("/user", authenticateToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password'); //-password means password exclude(remove) not include
        if (!data) {
            return res.status(404).send({ message: "User  not found" });
        }
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
});

//update-user
router.put("/user-update-address", authenticateToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address:address});
        res.status(200).send({message: "Addresses updated successfully"});
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
});



module.exports = router;
