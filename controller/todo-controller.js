// const db = require("../models/db");

// exports.getByUser = async (req, res, next) => {
//   try {
//     const todos = await db.todo.findMany({
//       where: { userId: req.user.id },
//     });
//     res.json({ todos });
//   } catch (err) {
//     next(err);
//   }
// };

exports.createTodo = async (req, res, next) => {
  const data = req.body;
  try {
    const rs = await db. Product.create({ 
        data: { ...data, userId: req.user.id } 
        
    });
    res.json({ msg: "Create OK", result: rs });
  } catch (err) {
    next(err);
  }
  console.log(data)
};

// exports.updateTodo = async (req, res, next) => {
//   const { id } = req.params;
//   const data = req.body;
//   try {
//     const rs = await db.todo.update({
//       data: { status: data.status },
//       where: { id:+id, userId: req.user.id },
//     });
//     res.json({ msg: "update ok", result: rs });
//   } catch (err) {
//     next(err);
//   }
// };
// exports.deleteTodo = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const rs = await db.todo.delete({
//       where: { id: +id, userId: req.user.id },
//     });
//     res.json({ msg: "delete ok", result: rs });
//   } catch (err) {
//     next(err);
//   }
// };
