const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Load New Relic agent
require("newrelic");

app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://testdb12com:ETxElrM3o7WbZYNa@testdb.whvfu2j.mongodb.net/?retryWrites=true&w=majority&appName=testdb",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const User = mongoose.model("User", {
  name: String,
  mobile: String,
  email: String,
  address: String,
  gender: String,
});

app.post("/users", async (req, res) => {
  // Start a transaction
  const transaction =
    require("newrelic").startBackgroundTransaction("Create User");

  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    // End the transaction
    // transaction.then();
  }
});

app.get("/users", async (req, res) => {
  // Start a transaction
  const transaction =
    require("newrelic").startBackgroundTransaction("Get Users");

  try {
    const users = await User.find({});
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    // End the transaction
    // transaction.then();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
