const db = require("../models/db");
const clounUpload = require("../utils/cloudupload");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.user.findMany();
    res.json({ users });
    next();
  } catch (err) {
    next(err);
  }
};

exports.getTables = async (req, res, next) => {
  try {
    const Tables = await db.tables.findMany();
    res.json({ Tables });
    next();
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const Product = await db.tables.findMany();
    res.json({ Product });
    console.log(Product);
  } catch (err) {
    next(err);
  }
};

exports.getcreateTodo = async (req, res, next) => {
  try {
    const {   
      tabes_price,
      Tables_status,
      Tables_img,
      Tables_details,
    } = req.body;
    const createTodo = await db.tables.create({
      data: {
        tabes_price: +tabes_price,
        Tables_status,
        Tables_img,
        Tables_details,
      },
    });
    res.json({ createTodo });
    next();
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getpayment = async (req, res, next) => {
  try {
    const payment = await db.payment.findMany();
    res.json({ payment });
    console.log(payment);
  } catch (err) {
    next(err);
  }
};

exports.getrecipt = async (req, res, next) => {
  try {
    const recipt = await db.recipt.findMany();
    res.json({ recipt });
    console.log(recipt);
  } catch (err) {
    next(err);
  }
};

exports.getbooking = async (req, res, next) => {
  try {
    const booking = await db.booking.findMany();
    res.json({ booking });
    console.log(booking);
  } catch (err) {
    next(err);
  }
};

exports.getCheck_information = async (req, res, next) => {
  try {
    const Check_information = await db.booking.findMany();
    res.json({ Check_information });
    console.log(Check_information);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct_details = async (req, res, next) => {
  const { Tables_id } = req.params;
  try {
    const rs = await db.tables.delete({ where: { Tables_id: +Tables_id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};
exports.deletepayment = async (req, res, next) => {
  const { payment_id } = req.params;
  try {
    const rs = await db.payment.delete({ where: { payment_id: +payment_id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};
exports.createBookings = async (req, res, next) => {
  const {
    booking_date_and_time,
    User_id,
    Tables_id,
    Numberoftables,
    location
  } = req.body;
  try {
    const dateTime = new Date(booking_date_and_time);
    // console.log(dateTime)                                                                                                                                                                                                  ime)
    const booking = await db.booking.create({
      data: {
        booking_date_and_time: dateTime,
        Numberoftables: +Numberoftables,
        location,
      
        Tables: {
          connect: {
            Tables_id: +Tables_id,
          },
        },
        User: {
          connect: {
            user_id: +User_id
          }
        }
      },
    });
    res.json({ booking });
    console.log(dateTime);
  } catch (err) {
    next(err);
    console.log(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  // validate req.params + req.body
  const { Tables_id } = req.params;
  const {
    Tables_img,
    Tables_themes,
    tabes_price,
    Tables_details,

    author,
  } = req.body;
  try {
    const rs = await db.tables.update({
      data: { Tables_img, Tables_themes, tabes_price, Tables_details },
      where: { Tables_id: Number(Tables_id) },
    });
    res.json({ msg: "Update ok", result: rs });
  } catch (err) {
    next(err);
  }
};
exports.getBookingId = async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const bookingID = await db.booking.findFirst({
      where: {
        booking_id: +bookingId,
      },
      include: {
        Tables: true,
      }
    });
    res.json({bookingID});
  } catch (err) {
    next(err);
    console.log(err)
  }
};
exports.deletebooking = async (req, res, next) => {
  const { booking_id } = req.params;
  try {
    const rs = await db.booking.delete({ where: { booking_id: +booking_id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.payment = async (req, res, next) => {
  try {
    const { paymentmethod, paymentamount } = req.body;
    const { bookingId } = req.params
    const imagePromise = req.files.map((file) => {
      return clounUpload(file.path);
    });
    const imageUrArray = await Promise.all(imagePromise); 

    const payment = await db.payment.create({
      data : {
        paymentmethod,
        paymentamount,
        paymentstatus : "pending",
        payment_img: imageUrArray[0],
        booking: {
          connect: {
            booking_id: +bookingId,
          } 
        }
      },
    });

    res.json({ msg: "payment successful" , payment});
  } catch (err) {
    next(err);
    console.log(err)
  }
};
exports.getrecipt_user = async (req, res, next) => {
  try {
    const recipt_user = await db.recipt.findMany();
    res.json({ recipt_user });
    console.log(recipt_user);
  } catch (err) {
    next(err);
  }
};

