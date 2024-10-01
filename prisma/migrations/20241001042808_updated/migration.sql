/*
  Warnings:

  - The primary key for the `BranchTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branchId` on the `BranchTeacher` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `BranchTeacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[initial]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchCode` to the `BranchTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherInitial` to the `BranchTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BranchTeacher" DROP CONSTRAINT "BranchTeacher_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchTeacher" DROP CONSTRAINT "BranchTeacher_teacherId_fkey";

-- AlterTable
ALTER TABLE "BranchTeacher" DROP CONSTRAINT "BranchTeacher_pkey",
DROP COLUMN "branchId",
DROP COLUMN "teacherId",
ADD COLUMN     "branchCode" TEXT NOT NULL,
ADD COLUMN     "teacherInitial" TEXT NOT NULL,
ADD CONSTRAINT "BranchTeacher_pkey" PRIMARY KEY ("teacherInitial", "branchCode");

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "initial" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_initial_key" ON "Teacher"("initial");

-- AddForeignKey
ALTER TABLE "BranchTeacher" ADD CONSTRAINT "BranchTeacher_teacherInitial_fkey" FOREIGN KEY ("teacherInitial") REFERENCES "Teacher"("initial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTeacher" ADD CONSTRAINT "BranchTeacher_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
