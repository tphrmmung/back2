const { transporter } = require("../configs/mail-no-reply");
const db = require("../models/db");
const clounUpload = require("../utils/cloudupload");
const jwt = require("jsonwebtoken");

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

exports.createTodo = async (req, res, next) => {
  try {
    const { tabes_price, Tables_details, deposit } = req.body;
    const imagePromise = req.files.map((file) => {
      return clounUpload(file.path);
    });
    const imageUrArray = await Promise.all(imagePromise);

    const createTodo = await db.tables.create({
      data: {
        Tables_img: imageUrArray[0],
        Tables_details,
        tabes_price: +tabes_price,
        deposit: Number(deposit),
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

exports.getpaymentByBooking = async (req, res, next) => {
  try {

    const { booking_id } = req.params;
    
    const payment = await db.payment.findMany({
      where: {
        bookingId: Number(booking_id)
      }
    });
    res.json({ payment });

  } catch (err) {
    next(err);
  }
};

exports.getrecipt = async (req, res, next) => {
  try {
    const recipt = await db.recipt.findMany({
      include: {
        Payment: {
          include: {
            booking: {
              include: {
                User: true,
                Tables: true,
                // Product: true,
              },
            },
          },
        },
      },
    });
    res.json({ recipt });
    // console.log(recipt);
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
// exports.getReservationForm_user = async (req, res, next) => {
//   try {
//     const ReservationForm_user = await db.payment.findMany();
//     res.json({ ReservationForm_user });
//     console.log(ReservationForm_user);
//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteProduct_details = async (req, res, next) => {
  const { Tables_id } = req.params;
  try {
    const rs = await db.tables.delete({ where: { Tables_id: +Tables_id } });
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
    location,
    bookingstatus,
        
  } = req.body;
  try {
    const dateTime = new Date(booking_date_and_time);

    const checkBooking = await db.booking.findMany({
      where: {
        AND: [{ Tablesid: Number(Tables_id) }, { bookingstatus: "approve" }],
      },
    });
    
    console.log(checkBooking.length);
    
    if (checkBooking.length >= 2) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถจองได้เนื่องจากครบจำนวน" });
    }

    const booking = await db.booking.create({
      data: {
        booking_date_and_time: dateTime,
        Numberoftables: +Numberoftables,
        location,
        bookingstatus,
        note,
        Tables: {
          connect: {
            Tables_id: +Tables_id,
          },
        },
        User: {
          connect: {
            user_id: +User_id,
          },
        },
      },
    });
    res.json({ booking });
    // console.log(dateTime);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updateStatusBookings = async (req, res, next) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;

    const updateStatus = await db.booking.update({
      where: {
        booking_id: Number(booking_id),
      },
      data: {
        bookingstatus: status,
      },
      include: {
        User: true,
      }
    });

    const payload = { id: updateStatus.User.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECERT, {
      expiresIn: "30d",
    });

    const mailOptions = {
      from: 'ชื่อเมล@gmail.com',  // ใช้ no-reply email address ที่คุณต้องการ
      to: updateStatus.User.email,  // อีเมลผู้รับ
      subject: `ระบบบจองโต๊ะจีน หมายเลข ID : ${updateStatus.booking_id}`,  // หัวข้อเมล
      text: `ระบบได้ทำการอนุมัติเรียบร้อยเเล้ว กรุณาชำระเงินหรือคลิกที่ลิ้งค์ด้านล่าง
      \nคลิกลิ้งค์
      \nhttp://localhost:5173/payment_user/${updateStatus.booking_id}/${token}
      \n\nหมายเหตุ : ข้อความและ e-mail นี้เป็นการสร้างอัตโนมัติจากระบบฯ ไม่ต้องตอบกลับ` 
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "ไม่สามารถส่ง email ได้"})
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: "อัพเดทข้อมูลเรียบร้อยแล้ว" });
        }
    })

  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { Tables_id } = req.params;
  const { Tables_img, tabes_price, Tables_details } = req.body;
  try {
    const rs = await db.tables.update({
      data: { Tables_img, tabes_price, Tables_details },
      where: { Tables_id: Number(Tables_id) },
    });
    res.json({ msg: "Update ok", result: rs });
  } catch (err) {
    console.log("Error during product update:", err); // เพิ่มการ log ข้อผิดพลาด
    next(err);
  }
};
// exports.updateProduct = async (req, res, next) => {
//   const { Tables_id } = req.params;
//   const {
//     Tables_img,
//     tabes_price,
//     Tables_details,
//     author,
//   } = req.body;
//   try {
//     const rs = await db.tables.update({
//       data: { Tables_img, tabes_price, Tables_details },
//       where: { Tables_id: Number(Tables_id) },
//     });
//     res.json({ msg: "Update ok", result: rs });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getBookingId = async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const bookingID = await db.booking.findFirst({
      where: {
        booking_id: +bookingId,
      },
      include: {
        Tables: true,
      },
    });
    res.json({ bookingID });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.payment = async (req, res, next) => {
  try {
    const { paymentmethod, paymentamount, deposit_amount, amount } = req.body;
    const { bookingId } = req.params;
    const imagePromise = req.files.map((file) => {
      return clounUpload(file.path);
    });
    const imageUrArray = await Promise.all(imagePromise);

    const remain = Number(amount) - Number(deposit_amount)

    const payment = await db.payment.create({
      data: {
        paymentmethod,
        paymentamount: amount,
        paymentstatus: "Pending",
        payment_img: imageUrArray[0],
        deposit_amount: Number(deposit_amount),
        remain,
        booking: {
          connect: {
            booking_id: +bookingId,
          },
        },
      },
    });

    res.json({ msg: "payment successful", payment });
  } catch (err) {
    next(err);
    console.log(err);
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

exports.getReservationForm_user = async (req, res, next) => {
  try {
    const ReservationForm_user = await db.recipt.findMany({
      include: {
        Payment: {
          include: {
            booking: {
              include: {
                User: true,
                Tables: true,
              },
            },
          },
        },
      },
    });
    res.json({ ReservationForm_user });
    console.log(ReservationForm_user);
  } catch (err) {
    next(err);
  }
};

exports.patchchgstatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // ค้นหาข้อมูลการชำระเงินตาม ID ก่อน
    const payment = await db.payment.findUnique({
      where: { Payment_id: Number(id) },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // ตรวจสอบสถานะปัจจุบัน
    if (payment.paymentstatus === "Paid" && status === "Pending") {
      // ถ้าสถานะเป็น "ชำระแล้ว" ไม่อนุญาตให้เปลี่ยนกลับไปเป็น "รอตรวจ"
      return res.status(400).json({
        message: "Cannot change status from Paid back to Pending",
      });
    }

    // อัปเดตสถานะถ้าตรวจสอบผ่าน
    const rs = await db.payment.update({
      data: {
        paymentstatus: status,
      },
      where: { Payment_id: Number(id) },
    });

    res.json({ message: "UPDATE Status", result: rs });
  } catch (err) {
    console.error("Error updating payment status:", err);
    next(err);
  }
};

exports.userbooking = async (req, res, next) => {
  try {
    const ReservationForm_user = await db.recipt.findMany({
      where: {
        Payment: {
          booking: {
            Userid: req.user.user_id,
          },
        },
      },
      include: {
        Payment: {
          include: {
            booking: {
              include: {
                User: true,
                Tables: true,
              },
            },
          },
        },
      },
    });
    res.json({ ReservationForm_user });
    // console.log(ReservationForm_user);
  } catch (err) {
    next(err);
  }
};

exports.createReceipt = async (req, res, next) => {
  const Payment_id = req.body.Payment_id; // แก้ไขการดึงค่า Payment_id จาก req.body
  console.log(Payment_id);
  try {
    const receipt = await db.recipt.create({
      data: {
        Payment: {
          connect: {
            Payment_id: Payment_id,
          },
        },
      },
    });
    res.json({ message: "create success", receipt });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getReceiptById = async (req, res, next) => {
  try {
    const { recpId } = req.params;
    const recipt = await db.recipt.findFirst({
      where: {
        Recipt_id: +recpId,
      },
      include: {
        Payment: {
          include: {
            booking: {
              include: {
                User: true,
                Tables: true,
              },
            },
          },
        },
      },
    });
    res.json({ message: "get success", recipt });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getbookingUser = async (req, res, next) => {
  try {
    const booking = await db.booking.findMany({
      include: {
        User: true,
        Tables: true,
      },
    });

    res.json({ booking });
    console.log(booking);
  } catch (err) {
    next(err);
  }
};

exports.getbooking = async (req, res, next) => {
  try {
    const booking = await db.booking.findMany({
      include: {
        User: true,
        Tables: true,
      },
      orderBy: {
        booking_id: "desc",
      },
    });

    res.json({ booking });
    console.log(booking);
  } catch (err) {
    next(err);
  }
};

exports.getBookingByID = async (req, res, next) => {
  try{
    const { table_id } = req.params;

    const checkBookingTable = await db.booking.findMany({
      where: {
        AND: [
          { Tablesid: Number(table_id) },
          { bookingstatus: 'approve' }
        ]
      }
    })

    if(checkBookingTable.length >= 2){
      return res.status(400).json({ message: "ไม่สามารถจองได้ในขณะนี้เนื่องจากจำนวนโต๊ะเต็มเเล้ว" })
    }

    res.json({message : "success!"})

  }catch(err){
    next(err)
    console.log(err)
  }
}
