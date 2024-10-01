import { CourseType } from "./course";

export type CourseTeacher = {
  teacherInitial: string;
  courseId: string;
  course: CourseType
}
