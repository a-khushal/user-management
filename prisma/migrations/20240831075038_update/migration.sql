/*
  Warnings:

  - Made the column `branchCode` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_branchCode_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "branchCode" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
