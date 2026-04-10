-- CreateTable
CREATE TABLE `CrisisLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `source` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `riskLevel` VARCHAR(191) NOT NULL,
    `alertSent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CrisisLog_userId_idx`(`userId`),
    INDEX `CrisisLog_riskLevel_idx`(`riskLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
