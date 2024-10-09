/*
  Warnings:

  - Added the required column `endTime` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;
