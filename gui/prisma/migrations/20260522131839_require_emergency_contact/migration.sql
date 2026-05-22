/*
  Warnings:

  - Made the column `emergencyContactName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyContactPhone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyContactRelation` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emergencyContactName" SET NOT NULL,
ALTER COLUMN "emergencyContactPhone" SET NOT NULL,
ALTER COLUMN "emergencyContactRelation" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
