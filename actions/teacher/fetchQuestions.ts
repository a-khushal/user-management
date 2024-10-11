"use server"
import db from "@/db"

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
    // console.log(res?.questions[0].options)
    // if (res && res.questions) {
    //   return res?.questions || []
    // }
    return res?.questions
  } catch (e) {
    console.log(e);
  }
} 
