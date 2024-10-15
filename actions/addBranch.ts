"use server"

import { revalidatePath } from 'next/cache'
import db from '../db/index'

export async function addBranch({ name, code, semester }: {
  name: string,
  code: string,
  semester: number
}) {
  try {
    await db.branch.create({
      data: {
        name: name,
        code: code,
        semester: semester
      }
    })

    revalidatePath("/");

    return {
      message: 'New Branch was created successfully!',
    }

  } catch (e) {
    console.log(e);
    return {
      error: "error while creating new branch"
    }
  }
}
