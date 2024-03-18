const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, firstname,lastname, email, phone,address } = req.body;
  console.log(req.body);
  try {
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fullfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      username,
      password: hashedPassword,
      firstname,
      lastname,
      email,
      phone,
      address,
      role: "USER",
    };
    const rs = await db.user.create({ data: data });
    console.log(rs);
    console.log(data);

    res.json({ msg: "Register successful" });
  } catch (err) {
    console.log(err);
    // next(err);
  }
};
module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!(username.trim() && password.trim())) {
      throw new Error("username or password must not blank");
    }

    const user = await db.user.findFirstOrThrow({ where: { username } });

    const pwOk = await bcrypt.compare(password, user.password);
    if (!pwOk) {
      throw new Error("invalid login");
    }

    const payload = { id: user.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECERT, {
      expiresIn: "30d",
    });
    console.log(token);
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res, next) => {
  res.json(req.user);
};
