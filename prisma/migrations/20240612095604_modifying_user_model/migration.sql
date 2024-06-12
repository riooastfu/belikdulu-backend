/*
  Warnings:

  - You are about to drop the column `defaultBillingAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `defaultShippingAddress` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `defaultBillingAddress`,
    DROP COLUMN `defaultShippingAddress`,
    ADD COLUMN `defaultBillingAddressId` VARCHAR(191) NULL,
    ADD COLUMN `defaultShippingAddressId` VARCHAR(191) NULL;
