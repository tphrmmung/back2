const { transporter } = require("../configs/mail-no-reply");
const db = require("../models/db");
const clounUpload = require("../utils/cloudupload");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        user_id: "asc",
      },
    });
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
    const Product = await db.tables.findMany({
      orderBy: {
        Tables_id: "desc",
      },
    });
    res.json({ Product });
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
    const payment = await db.payment.findMany({
      include: {
        booking: {
          include: {
            User: true,
            Tables: true,
          },
        },
      },
      orderBy: {
        Payment_id: "desc",
      },
    });
    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

exports.getpaymentByBooking = async (req, res, next) => {
  try {
    const { booking_id } = req.params;

    const payment = await db.payment.findMany({
      where: {
        bookingId: Number(booking_id),
      },
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
      orderBy: {
        Recipt_id: "desc",
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
        note: "",
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
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updateStatusBookings = async (req, res, next) => {
  try {
    const { booking_id } = req.params;
    const { status, note } = req.body;
    console.log(req.body)
    // อัปเดตสถานะการจอง
    const updateStatus = await db.booking.update({
      where: {
        booking_id: Number(booking_id),
      },
      data: {
        bookingstatus: status,
        note: note,
      },
      include: {
        User: true,
      },
    });

    // สร้าง payload สำหรับ JWT
    const payload = { id: updateStatus.User.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECERT, {
      expiresIn: "30d",
    });

    // สร้าง mailOptions เบื้องต้น
    let mailText = `เรียน ลูกค้าที่เคารพ

                การจองของท่านระบบได้ทำการอนุมัติเรียบร้อยแล้ว กรุณาดำเนินการชำระเงินหรือคลิกที่ลิ้งค์ด้านล่าง 
                หากท่านมีคำถามเพิ่มเติมหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมงานของเรา 098-620-1508

                ขอขอบคุณที่ใช้บริการ`;
    if (note) {
      mailText = `เรียน ลูกค้าผู้มีอุปการะคุณ

                  ทางระบบขอเรียนแจ้งให้ทราบว่า การจองของท่านได้ถูกยกเลิก เนื่องจากเหตุผลดังต่อไปนี้ : ${note}
                  หากท่านต้องการสอบถามข้อมูลเพิ่มเติมหรือมีข้อสงสัยใด ๆ สามารถติดต่อทีมงานของเราได้ทันที 
                  ทางเรายินดีให้บริการและแก้ไขปัญหาเพื่อความพึงพอใจสูงสุดของท่าน

                  ขออภัยในความไม่สะดวกที่เกิดขึ้น และขอขอบคุณที่ท่านให้ความสนใจและไว้วางใจในการใช้บริการของเรา

                  ขอแสดงความนับถือ
      \nหมายเหตุ : ข้อความและ e-mail นี้เป็นการสร้างอัตโนมัติจากระบบฯ ไม่ต้องตอบกลับ`;
    } else {
      mailText += `
      \nคลิกลิ้งค์
      \nhttp://localhost:5173/payment_user/${updateStatus.booking_id}/${token}
      \n\nหมายเหตุ : ข้อความและ e-mail นี้เป็นการสร้างอัตโนมัติจากระบบฯ ไม่ต้องตอบกลับ`;
    }

    const mailOptions = {
      from: "ชื่อเมล@gmail.com", // ใช้ no-reply email address ที่คุณต้องการ
      to: updateStatus.User.email, // อีเมลผู้รับ
      subject: `TarnTip เซ็นเตอร์โต๊ะจีน หมายเลข ID : ${updateStatus.booking_id}`, // หัวข้อเมล
      text: mailText, // ข้อความที่จะแสดงในอีเมล
    };

    // ส่งอีเมล
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "ไม่สามารถส่ง email ได้" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "อัพเดทข้อมูลเรียบร้อยแล้ว" });
      }
    });
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

// // อัปเดตข้อมูลโปรไฟล์
// exports.updateProfile = async (req, res, next) => {
//   const { userId } = req.params; // ดึง ID ของผู้ใช้จาก URL
//   const { profileImg, username, email, bio } = req.body; // ข้อมูลที่ต้องการอัปเดตจาก body ของ request

//   // ตรวจสอบข้อมูลที่ได้รับ
//   if (!username || !email) {
//     return res.status(400).json({ msg: "กรุณากรอกชื่อผู้ใช้และอีเมลให้ครบถ้วน" });
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userId, {
//       profileImg,
//       username,
//       email,
//       bio
//     }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ msg: "ไม่พบผู้ใช้ที่ต้องการอัปเดต" });
//     }
//     res.status(200).json({ msg: "อัปเดตข้อมูลโปรไฟล์สำเร็จ", user: updatedUser });
//   } catch (err) {
//     console.error("Error during profile update:", err);
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

    const remain = Number(amount) - Number(deposit_amount);

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
    // const bookingID = await db.booking.findFirst({
    //   where: {
    //     Userid: Number(req.user.user_id),
    //   },
    // });

    const booking = await db.payment.findMany({
      where: {
        booking: {
          User: {
            user_id: Number(req.user.user_id),
          }
        },
      },
      include: {
        booking: {
          include: {
            User: true,
            Tables: true,
          },
        },
      }, 
    });

    res.json({ booking });
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
  } catch (err) {
    next(err);
  }
};

exports.getBookingByID = async (req, res, next) => {
  try {
    const { table_id } = req.params;

    const checkBookingTable = await db.booking.findMany({
      where: {
        AND: [
          { Tablesid: Number(table_id) },
          { bookingstatus: "Waiting" || "approve" },
        ],
      },
    });

    if (checkBookingTable.length >= 2) {
      return res
        .status(400)
        .json({
          message: "ไม่สามารถจองได้ในขณะนี้เนื่องจากจำนวนโต๊ะเต็มเเล้ว",
        });
    }

    console.log(checkBookingTable.length)

    res.json({ message: "success!" });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getbookingWaitPay = async (req, res, next) => {
  try {
    const booking = await db.booking.findMany({
      where: {
        AND: [
          { Userid: Number(req.user.user_id )},
        ]
      },
      include: {
        User: true,
        Tables: true,
      },
      orderBy: {
        booking_id: "desc",
      },
    })

    res.json({ booking })
  }catch(err){
    next(err)
    console.log(err)
  }
}

exports.confirmPayment = async (req, res, next) => {
  try {
    const { Payment_id, Payment_Price } = req.body;

    const imagePromise = req.files.map((file) => {
      return clounUpload(file.path);
    });

    const imageUrArray = await Promise.all(imagePromise);

    const checkPayment = await db.payment.findFirst({
      where: {
        Payment_id: Number(Payment_id),
      },
    });

    const total_Price = Number(checkPayment.remain) - Number(Payment_Price);

    const confirmPay = await db.payment.update({
      where: {
        Payment_id: Number(Payment_id),
      },
      data: {
        total_pay_img: imageUrArray[0],
        paymentstatus: "Work",
        remain: Number(total_Price),
      },
      include: {
        booking: {
          include: {
            User: true,
            Tables: true,
          },
        },
      },
    });

    const changeBook = await db.booking.update({
      where: {
        booking_id: Number(confirmPay.booking.booking_id),
      },
      data: {
        bookingstatus: "success",
      },
    });

    res.json({ result: confirmPay, status: "success!", code: 200 });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
