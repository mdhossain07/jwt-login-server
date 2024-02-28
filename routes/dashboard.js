const router = require("express").Router();
const db = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // console.log(req.user);
    // res.send(req.user);

    const user = await db.query(
      "select user_name from users where user_id = $1",
      [req.user]
    );
    res.send(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
