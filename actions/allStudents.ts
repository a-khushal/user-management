"use server"

import { revalidatePath } from 'next/cache'
import db from '../db/index'

export async function allStudents({ code }: {
  code: string,
}) {
  try {
    const students = await db.student.findMany({
      where: {
        branchCode: code,
      },
      select: {
        name: true,
        email: true,
        usn: true,
        semester: true,
        branchCode: true,
      }
    })

    revalidatePath(`/admin/${code}`);

    return students;

  } catch (e) {
    console.log(e);
    return {
      error: "Error while fetching the data"
    }
  }
}
