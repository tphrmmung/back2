const bcrypt = require("bcryptjs");
const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;
  try {
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fullfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }
    const hashedPassword =await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      username,
      password: hashedPassword,
      email,
    };
    const rs = await db.user.create({ data })
    console.log(rs);

    res.json({ msg: "Register successful" });
  } catch (err) {
    next(err);
  }
};
module.exports.login = (req, res, next) => {
  res.send("in Login...");
};
