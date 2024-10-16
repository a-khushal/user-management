/*
  Warnings:

  - You are about to drop the column `semester` on the `Branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "semester";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "attempted" BOOLEAN NOT NULL DEFAULT false;
