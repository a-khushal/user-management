/*
  Warnings:

  - Added the required column `branchCode` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "branchCode" TEXT NOT NULL,
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
