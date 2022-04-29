const User = require("../users/users-model");

async function checkUser(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else if (!req.body.username) {
      res.status(401).json({
        message: "username and password required",
      });
    } else {
      res.status(422).json({
        message: "username taken",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function checkUserExists(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (users.length) {
      req.user = users[0];
      next();
    } else if (!req.body.username || !req.body.password) {
      res.status(401).json({
        message: "username and password required",
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkUser,
  checkUserExists,
};
