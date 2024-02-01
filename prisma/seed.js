const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')
const userData = [
    {username : 'andy', password , email : 'the_andt@gmail.com'},
    {username : 'mark', password , email : 'onyourm_ark@gmail.com'},
    {username : 'jaemin', password , email : 'najaemin_0813@gmail.com'},
    {username : 'haechan', password , email : 'haechananahceah@gmail.com'},
    {username : 'jeno', password , email : 'lee_jen_023@gmail.com'},
    {username : 'taeyong', password , email : 'ty@gmail.com'},
    {username : 'jungwoo', password , email : 'sugaringcandy@gmail.com'},
    {username : 'injun', password , email : 'yellow_3to3@gmail.com'},
    {username : 'chenle', password , email : 'K0nle@gmail.com'},
    {username : 'yuta', password , email : 'yuu_taa_26@gmail.com'},
    {username : 'hendery', password , email : 'iam_hendery@gmail.com'},
    {username : 'yangyang', password , email : 'yangyang@gmail.com'},

]

const todoData = [
    
    { title : 'Learn HTML' , duedate : new Date(), user_id: 1},
    { title : 'Learn HTML' , duedate : new Date(), user_id: 2},
    { title : 'Learn CSS' , duedate : new Date(), user_id: 4},
    { title : 'Learn JS' , duedate : new Date(), user_id: 7},
    { title : 'Learn React' , duedate : new Date(), user_id: 12},

]

const run = async () => {
    // await prisma.user.deleteMany({})
    // await prisma.user.createMany({
    //     data : userData
    // })

    
    // prisma.$executeRaw`Drop database ccac01_connect`
    // prisma.$executeRaw`create database ccac01_connect`

    await prisma.todo.deleteMany({
        data : userData
    })
    await prisma.todo.createMany({
        data : todoData
    })
}

run()