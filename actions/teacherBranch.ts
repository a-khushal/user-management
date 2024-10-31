'use server'
import db from '@/db/index'

export async function teacherBranch({ initial }: {
  initial: string
}) {
  try {
    const payload = await db.branchTeacher.findMany({
      where: {
        teacherInitial: initial,
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
            initial: true,
          }
        },
        branch: {
          select: {
            name: true,
            code: true,
          }
        }
      }
    });
    return payload
  } catch (e) {
    console.log(e);
    return {
      error: "Error while fetching the data"
    }
  }
}
