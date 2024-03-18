-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(72) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(10) NOT NULL,
    `role` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_date_and_time` DATE NOT NULL,
    `Numberoftables` INTEGER NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `User_id` INTEGER NOT NULL,
    `Tables_id` INTEGER NOT NULL,

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `Payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentmethod` VARCHAR(190) NOT NULL,
    `paymentamount` VARCHAR(10) NOT NULL,
    `paymentstatus` VARCHAR(200) NOT NULL,
    `booking_id` INTEGER NOT NULL,

    PRIMARY KEY (`Payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipt` (
    `Recipt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` VARCHAR(50) NOT NULL,
    `Payment_id` INTEGER NOT NULL,

    PRIMARY KEY (`Recipt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tables` (
    `Tables_id` INTEGER NOT NULL AUTO_INCREMENT,
    `Tables_img` VARCHAR(191) NOT NULL,
    `Tables_details` VARCHAR(100) NOT NULL,
    `tabes_price` INTEGER NOT NULL,
    `Tables_status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Tables_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_User_id_fkey` FOREIGN KEY (`User_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_Tables_id_fkey` FOREIGN KEY (`Tables_id`) REFERENCES `Tables`(`Tables_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipt` ADD CONSTRAINT `Recipt_Payment_id_fkey` FOREIGN KEY (`Payment_id`) REFERENCES `Payment`(`Payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;
