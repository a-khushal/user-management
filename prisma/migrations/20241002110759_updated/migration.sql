/*
  Warnings:

  - The primary key for the `StudentTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teacherId` on the `StudentTeacher` table. All the data in the column will be lost.
  - Added the required column `teacherInitial` to the `StudentTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentTeacher" DROP CONSTRAINT "StudentTeacher_teacherId_fkey";

-- AlterTable
ALTER TABLE "StudentTeacher" DROP CONSTRAINT "StudentTeacher_pkey",
DROP COLUMN "teacherId",
ADD COLUMN     "teacherInitial" TEXT NOT NULL,
ADD CONSTRAINT "StudentTeacher_pkey" PRIMARY KEY ("usn", "teacherInitial");

-- AddForeignKey
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_teacherInitial_fkey" FOREIGN KEY ("teacherInitial") REFERENCES "Teacher"("initial") ON DELETE RESTRICT ON UPDATE CASCADE;
