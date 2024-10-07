/*
  Warnings:

  - The primary key for the `BranchTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CourseOfStudent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CourseOfTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[teacherInitial,branchCode]` on the table `BranchTeacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usn,courseId]` on the table `CourseOfStudent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherInitial,courseId]` on the table `CourseOfTeacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usn,teacherInitial]` on the table `StudentTeacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BranchTeacher" DROP CONSTRAINT "BranchTeacher_pkey";

-- AlterTable
ALTER TABLE "CourseOfStudent" DROP CONSTRAINT "CourseOfStudent_pkey";

-- AlterTable
ALTER TABLE "CourseOfTeacher" DROP CONSTRAINT "CourseOfTeacher_pkey";

-- AlterTable
ALTER TABLE "StudentTeacher" DROP CONSTRAINT "StudentTeacher_pkey";

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 10,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "teacherInitial" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchTeacher_teacherInitial_branchCode_key" ON "BranchTeacher"("teacherInitial", "branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOfStudent_usn_courseId_key" ON "CourseOfStudent"("usn", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOfTeacher_teacherInitial_courseId_key" ON "CourseOfTeacher"("teacherInitial", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTeacher_usn_teacherInitial_key" ON "StudentTeacher"("usn", "teacherInitial");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_teacherInitial_fkey" FOREIGN KEY ("teacherInitial") REFERENCES "Teacher"("initial") ON DELETE RESTRICT ON UPDATE CASCADE;
