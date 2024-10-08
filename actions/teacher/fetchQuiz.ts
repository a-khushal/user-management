"use server"
//import { revalidatePath } from "next/cache";
import { Teacher } from "@prisma/client"
import db from "../../db"
import { Quiz } from "@prisma/client"
import { getServerSession } from "next-auth"
import { AuthOptions } from "next-auth"
import { authOptions } from "@/app/authStore/auth"

interface quiz {
  id: number,
  title: string,
  date: Date,
  startTime: Date,
}

export async function fetchQuiz({ initial }: { initial: Teacher['initial'] }) {
  try {
    const quizzes: quiz[] = await db.quiz.findMany({
      where: {
        teacherInitial: initial,
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        date: true
      }
    })
    return quizzes;
  } catch (e) {
    return {
      error: "Error while fetching data"
    }
  }
}
