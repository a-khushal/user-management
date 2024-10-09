"use server";

import { revalidatePath } from "next/cache";
import db from "../../db";
import { Teacher } from "@prisma/client";
import { Course } from "@prisma/client";
import { Branch } from "@prisma/client";

export async function createQuiz({ title, date, startTime, totalQuestions,endTime, teacher,course,branch }: {
  title: string,
  date: Date,
  startTime: Date,
  endTime:Date,
  totalQuestions: number,
  teacher: Teacher['initial'],
  course: Course['courseId'],
  branch: Branch['code']
}) {

  try {
    await db.quiz.create({
      data: {
        title: title,
        date: date,
        startTime: startTime,
        endTime:endTime,
        totalQuestions: totalQuestions,
        teacher: {
          connect: { initial: teacher }
        },
        course: {
          connect: { courseId: course }
        },
        branch: {
          connect: { code: branch }
        }
      }
    })
    revalidatePath("/");

    return {
      message: ' Quiz created successfully'
    }
  } catch (e) {
    console.log(e);
    return {
      error: "Error occured during quiz creation"
    }
  }

}
