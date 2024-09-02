-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CS', 'CY', 'CD');

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'hello@user',
    "usn" TEXT NOT NULL,
    "branch" "Branch" NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOfStudent" (
    "usn" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseOfStudent_pkey" PRIMARY KEY ("usn","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_usn_key" ON "Student"("usn");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseId_key" ON "Course"("courseId");

-- AddForeignKey
ALTER TABLE "CourseOfStudent" ADD CONSTRAINT "CourseOfStudent_usn_fkey" FOREIGN KEY ("usn") REFERENCES "Student"("usn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfStudent" ADD CONSTRAINT "CourseOfStudent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
