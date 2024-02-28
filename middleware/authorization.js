const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      res.status(403).send({ message: "Unauthorized access" });
    }

    const payload = jwt.verify(jwtToken, process.env.secret_key);

    req.user = payload.user;

    next();
  } catch (error) {
    console.log(err);
    res.status(403).send({ message: "Unauthorized access" });
  }
};

module.exports = authorization;
