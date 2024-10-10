"use server"
import { revalidatePath } from "next/cache"
import db from "@/db"

export async function deleteQuiz({ id, initial, courseID, branch }: { id: number, initial: string, courseID: string, branch: string }) {
  try {
    await db.quiz.delete({
      where: {
        id: id,
        courseId: courseID,
        teacherInitial: initial,
        branchCode: branch
      }
    })
    return {
      message: "Successfully deleted"
    }
  } catch (e) {
    console.log(e);
    return {
      error: "Error during deletion"
    }
  }
}
