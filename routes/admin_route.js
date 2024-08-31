const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
// const todoController = require('../controller/todo-controller')
const adminController = require('../controller/admin-controller')
const upload = require('../middlewares/upload')


router.get("/users", adminController.getUsers) // แสดงข้อมูลผู้ใช้
router.get("/Tables", adminController.getTables) // แสดงข้อมูลโต๊ะ
router.get("/Product", adminController.getProduct) //// แสดงข้อมูลผู้ใช้
router.post("/createTodo" ,upload.array("image" , 2),adminController.createTodo)
router.get("/payment", adminController.getpayment)
router.get("/payment/:booking_id", adminController.getpaymentByBooking)
router.get("/recipt", authenticate, adminController.getrecipt)
router.get("/booking", adminController.getbooking)
router.get("/bookinguser", adminController.getbookingUser)
router.get("/booking/table/:table_id", adminController.getBookingByID)


router.get("/Check_information",adminController.getCheck_information)

router.get("/booking/:bookingId",adminController.getBookingId)

router.get("/recipt_user",adminController.getrecipt_user)
router.get("/receipt/:recpId", adminController.getReceiptById)
// router.get("/ReservationForm_user",adminController.getReservationForm_user)
router.get("/userbooking", authenticate,adminController.userbooking)


router.post("/receipt",adminController.createReceipt)
router.post("/bookings", adminController.createBookings)
router.post('/payment/:bookingId' ,authenticate,  upload.array("image" , 1),adminController.payment)


router.delete("/deleteProduct_details/:Tables_id", adminController.deleteProduct_details)
router.patch('/updateProduct/:Tables_id',adminController.updateProduct)
router.patch('/payment/:id',authenticate,adminController.patchchgstatus)
router.patch('/bookings/status/:booking_id', authenticate, adminController.updateStatusBookings)

// router.get("/Tadles", adminController.getTadles)

// router.get('/', authenticate , todoController.getByUser)
// router.post('/', authenticate , todoController.createTodo)
// router.put('/:id' , authenticate,todoController.updateTodo)
// router.delete('/:id' , authenticate, todoController.deleteTodo)

module.exports = router