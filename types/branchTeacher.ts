import { Teacher } from "./teacher"
import { Branch } from "./branch";

export type BranchTeacher = {
  teacherInitial: string;
  branchCode: string;
  teacher: Teacher,
  branch: Branch
}
