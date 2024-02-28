const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

// register route

router.post("/register", async (req, res) => {
  try {
    // destructing the payload
    const { name, email, password } = req.body;

    // check if the user already exists or not
    const user = await db.query("select * from users where user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send({ message: "User already exist" });
    }

    //   decrypting the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //   addigng new user to the database
    const newUser = await db.query(
      "insert into users (user_name, user_email, user_password) values ($1, $2, $3) returning *",
      [name, email, bcryptPassword]
    );

    //   generate jwt token

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    // destructuring the payload
    const { email, password } = req.body;

    // check if the user exits on db or not (if not then throw error)
    const user = await db.query("select * from users where user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      res.status(401).send({ message: "User doesn't exist" });
    }

    //   check if the password matches with database password
    const validPassword = bcrypt.compare(password, user.rows[0].user_password);

    if (!validPassword) {
      res.status(401).send({ message: "Email or password doesn't match" });
    }
    //   generating JWT token
    const token = jwtGenerator(user.rows[0].user_id);

    res.send({ token });
  } catch (error) {
    console.log(error);
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
