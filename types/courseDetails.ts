import { CourseType } from "./course";

export type CourseDetailsType = {
    email: string;
    usn: string;
    name: string;
    branch: {
        id: number;
        name: string;
        code: string;
    } | null;
    semester: number;
    courses: {
        course: CourseType
    }[];
    
}