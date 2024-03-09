require("newrelic");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Load New Relic agent

const app = express();

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
    console.log("Connected To MongoDB Database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
mongoose.Promise = global.Promise;
const User = mongoose.model("User", {
  name: String,
  mobile: String,
  email: String,
  address: String,
  gender: String,
});

app.post("/users", async (req, res) => {
  // Start a transaction
  const transaction = require("newrelic").startWebTransaction("Create User");

  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
    newrelic.endTransaction();
  } catch (err) {
    res.status(400).json({ message: err.message });
    newrelic.endTransaction();
  } finally {
    // End the transaction
    newrelic.endTransaction();
  }
});

app.get("/users", async (req, res) => {
  // Start a transaction
  const transaction = require("newrelic").startWebTransaction("Get Users");

  try {
    const users = await User.find({});
    res.json({ users });
    newrelic.endTransaction();
  } catch (err) {
    res.status(500).json({ message: err.message });
    newrelic.endTransaction();
  } finally {
    // End the transaction
    // transaction.then();
    newrelic.endTransaction();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
