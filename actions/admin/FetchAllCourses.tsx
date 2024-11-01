"use server"

import db from '@/db/index'

export default async function FetchAllCourses({ semester, branchCode }: {
    semester: number,
    branchCode: string
}) {
    try{
        const courses = await db.course.findMany({
            where: {
                branchCode,
                semester
            }, 
            select: {
                title: true,
                courseId: true
            }
        })

        return {
            type: "success",
            courses
        }
    } catch(e) {
        console.log(e)
        return {
            type: "error",
            msg: "Error while fetching the courses"
        }
    }
}
