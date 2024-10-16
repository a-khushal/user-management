"use server"

import { revalidatePath } from 'next/cache'
import db from '../db/index'

export async function addBranch({ name, code }: {
  name: string,
  code: string
}) {
  try {
    await db.branch.create({
      data: {
        name: name,
        code: code,
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
