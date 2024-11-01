import { authOptions } from "@/app/authStore/auth"
import { getServerSession } from "next-auth"
import db from '@/db/index'
import { SidebarComponent } from "./Sidebar";
import { CourseDetailsType } from "@/types/courseDetails";

async function getCourseDetails() {
    try {
        const session = await getServerSession(authOptions);

        const student = await db.student.findUnique({
            where: {
                email: session.user.email,
            }, 
            select: {
                email: true,
                usn: true,
                name: true,
                branch: {
                    select: {
                        id: true,
                        code: true,
                        name: true,  
                    }
                },
                semester: true,
                courses: {
                    select: {
                        course: {
                            select: {
                                courseId: true,
                                title: true,
                                description: true,
                            }
                        }
                    }
                },
            }
        })

        return student;
    } catch(e) {
        console.log(e);
    }
}

export default async function StudentDashboard() {
    const course = await getCourseDetails();

    if (course !== null && course !== undefined) {
        const allCourses: CourseDetailsType = course; 

        return <>
            <SidebarComponent allCourses = { allCourses }/>
        </>
    } else {
        <div>
            error
        </div>
    }
}