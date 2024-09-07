const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, firstname, lastname, email, phone, address } = req.body;
  console.log(req.body);

  try {
    // ตรวจสอบว่ามีการกรอกข้อมูลที่จำเป็นครบถ้วน
    if (!(username && password && confirmPassword && email)) {
      return next(new Error("กรุณากรอกข้อมูลให้ครบถ้วน"));
    }

    // ตรวจสอบการยืนยันรหัสผ่าน
    if (confirmPassword !== password) {
      throw new Error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
    }

    // ตรวจสอบว่ามีอีเมลนี้ในฐานข้อมูลแล้วหรือไม่
    const existingUser = await db.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(422).json({ message: "อีเมลนี้ถูกลงทะเบียนไว้แล้ว" });
    }
    
    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    // สร้างผู้ใช้ใหม่
    const data = {
      username,
      password: hashedPassword,
      firstname,
      lastname,
      email,
      phone,
      address,
      role: "USER", // ตรวจสอบว่าค่าของ role ถูกต้อง
    };

    await prisma.user.create({ data });

    res.json({ msg: "การลงทะเบียนสำเร็จ" });
  } catch (err) {
    console.log(err);
    next(err);
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

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res, next) => {
  res.json(req.user);
};
