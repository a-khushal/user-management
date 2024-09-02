/*
  Warnings:

  - You are about to drop the column `branchId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_branchId_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "branchId",
ADD COLUMN     "branchCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("code") ON DELETE SET NULL ON UPDATE CASCADE;
