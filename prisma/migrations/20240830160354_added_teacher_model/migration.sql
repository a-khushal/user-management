-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'hello@user',

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOfTeacher" (
    "teacherId" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseOfTeacher_pkey" PRIMARY KEY ("teacherId","courseId")
);

-- CreateTable
CREATE TABLE "StudentTeacher" (
    "usn" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "StudentTeacher_pkey" PRIMARY KEY ("usn","teacherId")
);

-- AddForeignKey
ALTER TABLE "CourseOfTeacher" ADD CONSTRAINT "CourseOfTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfTeacher" ADD CONSTRAINT "CourseOfTeacher_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_usn_fkey" FOREIGN KEY ("usn") REFERENCES "Student"("usn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
