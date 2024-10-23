/*
  Warnings:

  - You are about to drop the column `attempted` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "attempted",
ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false;
