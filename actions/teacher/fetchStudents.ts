"use server"
import db from "../../db/index"

export const fetchStudents = async ({ branchCode, teacherInitial }: {
  branchCode: string,
  teacherInitial: string,
}) => {
  try {
    const payload = await db.studentTeacher.findMany({
      where: {
        teacherInitial,
        student: {
          branchCode: branchCode
        }
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            usn: true,
          }
        }
      }
    });
    return {
      payload
    }
  } catch (e) {
    console.log(e);
    return {
      error: "An error occured."
    }
  }
}
