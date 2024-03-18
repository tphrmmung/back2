const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
// const todoController = require('../controller/todo-controller')
const adminController = require('../controller/admin-controller')
const upload = require('../middlewares/upload')

router.get("/users", adminController.getUsers)
router.get("/Tables", adminController.getTables)
router.get("/Product", adminController.getProduct)
router.post("/createTodo",adminController.getcreateTodo)
router.get("/payment", adminController.getpayment)
router.get("/recipt", adminController.getrecipt)
router.get("/booking", adminController.getbooking)
router.get("/Check_information",adminController.getCheck_information)
router.get("/booking/:bookingId",adminController.getBookingId)
router.get("/recipt_user",adminController.getrecipt_user)



router.delete("/deleteProduct_details/:Tables_id", adminController.deleteProduct_details)
router.delete("/deletepayment/:payment_id", adminController.deletepayment)



router.delete("/deletebooking/:booking_id", authenticate, adminController.deletebooking)

router.patch('/updateroduct/:Tables_id',adminController.updateProduct)

router.post("/bookings", adminController.createBookings)
router.post('/payment/:bookingId' ,authenticate,  upload.array("image" , 1),adminController.payment)
// router.get("/Tadles", adminController.getTadles)

// router.get('/', authenticate , todoController.getByUser)
// router.post('/', authenticate , todoController.createTodo)
// router.put('/:id' , authenticate,todoController.updateTodo)
// router.delete('/:id' , authenticate, todoController.deleteTodo)

module.exports = router