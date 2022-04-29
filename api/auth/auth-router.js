const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../users/users-model");
const { checkUser, checkUserExists } = require("./auth-middleware");
const { BCRYPT_ROUNDS, JWT_SECRET } = require("../../config/index");

router.post("/register", checkUser, (req, res, next) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);

  User.add({ username, password: hash })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.post("/login", checkUserExists, (req, res, next) => {
  let { username, password } = req.body;

  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `welcome, ${user.username}`,
          token,
        });
      }
    })
    .catch(next);
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

module.exports = router;
