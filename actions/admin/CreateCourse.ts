"use server"

import db from '../../db/index'

interface paramsType {
  courseCode: string;
  title: string;
  description?: string | undefined;
}

export async function createCourse(params: paramsType) {
  try {
    await db.course.create({
      data: {
        title: params.title,
        courseId: params.courseCode,
        description: params.description
      }
    })

    return {
      type: "success",
      msg: "Course created successfully"
    }
  } catch (e) {
    console.log(e)
    return {
      type: "error",
      msg: "Error while creating course"
    }
  }
}
