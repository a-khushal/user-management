"use server";

import { revalidatePath } from "next/cache";
import db from "../../db";
import { Teacher } from "@prisma/client";
import { Course } from "@prisma/client";
import { Branch } from "@prisma/client";
import { QuizData } from "@/components/teacher/CreateQuizForm";

export async function createQuiz({ title, date, startTime, totalQuestions, endTime, questions, duration, teacher, course, branch }: {
  title: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  duration: number,
  totalQuestions: number,
  teacher: Teacher['initial'],
  course: Course['courseId'],
  branch: Branch['code'],
  questions: QuizData[]
}) {

  try {
    await db.quiz.create({
      data: {
        title: title,
        date: date,
        startTime: startTime,
        endTime: endTime,
        totalQuestions: totalQuestions,
        duration: duration,
        teacher: {
          connect: { initial: teacher }
        },
        course: {
          connect: { courseId: course }
        },
        branch: {
          connect: { code: branch }
        },
        questions: {
          create: questions.map((question) => ({
            questionText: question.questionText,
            defaultMark: question.defaultMark,
            numberOfOptions: question.numberOfOptions,
            options: {
              create: question.options.map((option) => ({
                optionText: option.optionText,
                optionMark: option.optionMark,
              })),
            },
          })),
        },
      }
    })
    revalidatePath("/");

    return {
      message: 'Quiz created successfully'
    }
  } catch (e) {
    console.log(e);
    return {
      error: "Error occured during quiz creation"
    }
  }

}
