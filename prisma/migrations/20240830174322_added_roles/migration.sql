-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'TEACHER');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TEACHER';

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
