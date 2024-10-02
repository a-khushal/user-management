/*
  Warnings:

  - The primary key for the `CourseOfTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teacherId` on the `CourseOfTeacher` table. All the data in the column will be lost.
  - Added the required column `teacherInitial` to the `CourseOfTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseOfTeacher" DROP CONSTRAINT "CourseOfTeacher_teacherId_fkey";

-- AlterTable
ALTER TABLE "CourseOfTeacher" DROP CONSTRAINT "CourseOfTeacher_pkey",
DROP COLUMN "teacherId",
ADD COLUMN     "teacherInitial" TEXT NOT NULL,
ADD CONSTRAINT "CourseOfTeacher_pkey" PRIMARY KEY ("teacherInitial", "courseId");

-- AddForeignKey
ALTER TABLE "CourseOfTeacher" ADD CONSTRAINT "CourseOfTeacher_teacherInitial_fkey" FOREIGN KEY ("teacherInitial") REFERENCES "Teacher"("initial") ON DELETE RESTRICT ON UPDATE CASCADE;
