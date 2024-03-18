const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
    await prisma.$executeRawUnsafe('DROP Database cca01_connect')
    await prisma.$executeRawUnsafe('CREATE Database cca01_connect')
}
console.log('Reset DB')
run()