"use server"
//import { revalidatePath } from "next/cache";
import { Teacher } from "@prisma/client"
import db from "../../db"
import { Quiz } from "@prisma/client"
import { getServerSession } from "next-auth"
import { AuthOptions } from "next-auth"
import { authOptions } from "@/app/authStore/auth"
import { Course } from "@prisma/client"
import { Branch } from "@prisma/client"

export interface quiz {
  id: number,
  title: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  duration: number
}
export interface squiz {
  id: number,
  attempted: boolean,
  title: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  duration: number,
  course: Course
}

export async function fetchQuiz({ initial, course, branch }: { initial: Teacher['initial'], course: Course['courseId'], branch: Branch['code'] }) {
  try {
    const quizzes: quiz[] = await db.quiz.findMany({
      where: {
        teacherInitial: initial,
        branchCode: branch,
        courseId: course
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        date: true,
        duration: true,
        attempted: true
      }
    })
    return quizzes;
  } catch (e) {
    console.log(e)
    return {
      error: "Error while fetching data"
    }
  }
}


export async function getQuiz({ courses, branch }: { courses: Course['courseId'][], branch?: Branch['code'] }) {
  try {
    const quizzes = await db.quiz.findMany({
      where: {
        courseId: {
          in: courses
        },
        branchCode: branch
      },
      select: {
        course: true,
        attempted: true,
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        date: true,
        duration: true
      }
    })
    return quizzes
  } catch (e) {
    console.log(e)
    return {
      error: "Error fetching data"
    }
  }
}
