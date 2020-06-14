const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");

// Connect to MongoDB
mongoose
  .connect("mongodb://192.168.1.57:27117/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// Middlewares
app.use(express.json());
app.use("/api/genres", genres);

// Listening port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
