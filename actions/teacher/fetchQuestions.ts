"use server"
import { revalidatePath } from "next/cache"
import db from "@/db"
import { Question } from "@prisma/client"

export default async function({ quizId }: { quizId: number }) {
  try {
    const res = await db.quiz.findUnique({
      where: {
        id: quizId
      },
      select: {
        questions: {
          select: {
            id: true,
            questionText: true,
            defaultMark: true,
            numberOfOptions: true,
            correctOptionID:true,
            options: {
              select: {
                id: true,
                optionMark: true,
                optionText: true
              }
            }
          }
        }
      }
    })
    if (res && res.questions) {
      console.log(typeof (res));
      return res?.questions || []
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getQuestions({ quizId }: { quizId: number }) {
  try {
    const res = await db.quiz.findUnique({
      where: {
        id: quizId
      },
      select: {
        duration: true,
        expired: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            defaultMark: true,
            numberOfOptions: true,
            options: {
              select: {
                id: true,
                optionMark: true,
                optionText: true
              }
            }
          }
        }
      }
    })
    if (res && res.questions && res.duration)
      return res;
  } catch (e) {
    console.log(e);
    return {
      error: "Error fetching data"
    }
  }
}

export async function update({ quizId }: { quizId: number }) {
  try {
    const res = await db.quiz.update({
      where: {
        id: quizId
      },
      data: {
        expired: true
      }
    })
    console.log("Updated")
  } catch (e) {
    console.log(e);
  }
}
