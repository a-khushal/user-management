'use server'
import db from '@/db/index'

export async function fetchCourses({ initial }: {
  initial: string
}) {
  try {
    const payload = await db.courseOfTeacher.findMany({
      where: {
        teacherInitial: initial,
      },
      include: {
        course: {
          select: {
            courseId: true,
            title: true,
            description: true,
          },
        },
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
