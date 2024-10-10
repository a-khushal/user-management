-- DropIndex
DROP INDEX "BranchTeacher_teacherInitial_branchCode_key";

-- DropIndex
DROP INDEX "CourseOfStudent_usn_courseId_key";

-- DropIndex
DROP INDEX "CourseOfTeacher_teacherInitial_courseId_key";

-- DropIndex
DROP INDEX "StudentTeacher_usn_teacherInitial_key";

-- AlterTable
ALTER TABLE "BranchTeacher" ADD CONSTRAINT "BranchTeacher_pkey" PRIMARY KEY ("teacherInitial", "branchCode");

-- AlterTable
ALTER TABLE "CourseOfStudent" ADD CONSTRAINT "CourseOfStudent_pkey" PRIMARY KEY ("usn", "courseId");

-- AlterTable
ALTER TABLE "CourseOfTeacher" ADD CONSTRAINT "CourseOfTeacher_pkey" PRIMARY KEY ("teacherInitial", "courseId");

-- AlterTable
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_pkey" PRIMARY KEY ("usn", "teacherInitial");
