const express = require('express')
const router = express.Router()
// const authenticate = require('../middlewares/authenticate')
// const todoController = require('../controller/todo-controller')
const adminController = require('../controller/admin-controller')

router.get("/users", adminController.getUsers)
// router.get("/Tadles", adminController.getTadles)

// router.get('/', authenticate , todoController.getByUser)
// router.post('/', authenticate , todoController.createTodo)
// router.put('/:id' , authenticate,todoController.updateTodo)
// router.delete('/:id' , authenticate, todoController.deleteTodo)

module.exports = router