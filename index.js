const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middlewares

app.use(cors());
app.use(express.json());

// routes

// register & login routes

app.use("/auth", require("./routes/jwtAuth"));

// dashbaord route

app.use("/dashboard", require("./routes/dashboard"));

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
