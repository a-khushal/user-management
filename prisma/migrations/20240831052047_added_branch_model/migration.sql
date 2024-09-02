/*
  Warnings:

  - You are about to drop the column `branch` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "branch",
ADD COLUMN     "branchId" INTEGER;

-- DropEnum
DROP TYPE "Branch";

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchTeacher" (
    "teacherId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "BranchTeacher_pkey" PRIMARY KEY ("teacherId","branchId")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTeacher" ADD CONSTRAINT "BranchTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTeacher" ADD CONSTRAINT "BranchTeacher_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
