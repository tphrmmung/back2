const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('12345')
const adminP = bcrypt.hashSync('admin')
const userData = [
    {username : 'tip', password , email : 'tip@gmail.com',firstname:'tip',lastname: "tt", phone : "0321654789",address:"บ้านไร่นาๆไพ",role:'USER' },
    {username : 'Jeff', password , email : 'jsff@gmail.com', firstname:'Jeff',lastname: "tt",phone : "0321654789",address:"บ้านไร่นาๆไพ",role:'USER' },
    {username : 'Bonz', password , email : 'Bonz@gmail.com', firstname:'Bonz',lastname: "tt",phone : "0321654789",address:"บ้านไร่นาๆไพ", role:'ADMIN' },
    {username : 'benz', password , email : 'Benz@gmail.com',firstname:'benz',lastname: "tt",phone : "0321654789",address:"บ้านไร่นาๆไพ", role:'USER' },
    {username : 'war', password , email : 'war@gmail.com',firstname:'war',lastname: "tt",phone : "0321654789",address:"บ้านไร่นาๆไพ",  role:'ADMIN'},
    {username : 'admin', password: adminP , email : 'admin@gmail.com',firstname:'admin',lastname: "tt",phone : "0000000000",address:"บ้านไร่นาๆไพ",  role:'ADMIN'},

]

// const todoData = [
    
//     { title : 'Learn HTML' , duedate : new Date(), userId: 1},
//     { title : 'Learn HTML' , duedate : new Date(), userId: 2},
//     { title : 'Learn CSS' , duedate : new Date(), userId: 4},
//     { title : 'Learn JS' , duedate : new Date(), userId: 5},
   
// ]

const run = async () => {
    // await prisma.user.deleteMany({})
    await prisma.user.createMany({
        data : userData
    })

    
    // prisma.$executeRaw`Drop database ccac01_connect`
    // prisma.$executeRaw`create database ccac01_connect`


    
    // await prisma.user.createMany({
    //     data : userData,
    // });
    // await prisma.tod.createMany({
    //     data : todoData,
    // })
}

run()                                                                                                     