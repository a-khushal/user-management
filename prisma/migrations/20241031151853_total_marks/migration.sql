/*
  Warnings:

  - Added the required column `totalMarks` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "totalMarks" INTEGER NOT NULL;
