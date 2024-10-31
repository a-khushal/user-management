// 'use client'
//
// import { useState } from 'react'
// import { useParams } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Download, Upload, Plus, Trash2 } from "lucide-react"
//
// interface Person {
//   id: string
//   name: string
//   email: string
//   branch: string
//   semester: string
// }
//
// interface Student extends Person {
//   usn: string
// }
//
// interface Teacher extends Person {
//   initial: string
//   courses: string
// }

import CreateCourseForm from "@/components/admin/CreateCourseForm";

// export default function AcademicManagement() {
//   const params = useParams()
//   const [students, setStudents] = useState<Student[]>([
//     { id: '1', name: 'John Doe', email: 'john@example.com', usn: 'USN001', branch: params.branch as string, semester: params.semester as string },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', usn: 'USN002', branch: params.branch as string, semester: params.semester as string },
//   ])
//   const [teachers, setTeachers] = useState<Teacher[]>([
//     { id: '1', name: 'Prof. Alice Johnson', email: 'alice@example.com', initial: 'AJ', courses: 'Mathematics, Algebra', branch: params.branch as string, semester: params.semester as string },
//     { id: '2', name: 'Dr. Bob Williams', email: 'bob@example.com', initial: 'BW', courses: 'Physics, Quantum Mechanics', branch: params.branch as string, semester: params.semester as string },
//   ])
//   const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
//     name: '',
//     email: '',
//     usn: '',
//     branch: params.branch as string,
//     semester: params.semester as string,
//   })
//   const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
//     name: '',
//     email: '',
//     initial: '',
//     courses: '',
//     branch: params.branch as string,
//     semester: params.semester as string,
//   })
//
//   const handleDeleteStudent = (id: string) => {
//     setStudents(students.filter(s => s.id !== id))
//   }
//
//   const handleDeleteTeacher = (id: string) => {
//     setTeachers(teachers.filter(t => t.id !== id))
//   }
//
//   const handleAddStudent = () => {
//     const id = (students.length + 1).toString()
//     setStudents([...students, { id, ...newStudent }])
//     setNewStudent({ name: '', email: '', usn: '', branch: params.branch as string, semester: params.semester as string })
//   }
//
//   const handleAddTeacher = () => {
//     const id = (teachers.length + 1).toString()
//     setTeachers([...teachers, { id, ...newTeacher }])
//     setNewTeacher({ name: '', email: '', initial: '', courses: '', branch: params.branch as string, semester: params.semester as string })
//   }
//
//   const downloadTemplate = (type: 'student' | 'teacher') => {
//     console.log(`Downloading ${type} template...`)
//   }
//
//   const uploadExcel = (event: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'teacher') => {
//     console.log(`Uploading ${type} Excel file...`)
//   }
//
//   return (
//     <div className="min-h-screen bg-background p-2 sm:p-4">
//       <div className="grid lg:grid-cols-2 gap-4">
//         <Card className="col-span-1">
//           <CardHeader className="border-b p-4">
//             <CardTitle className="text-lg sm:text-xl">Student Management - {params.branchCode} (Semester - {params.semesterNo})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-2 sm:p-4">
//             <div className="mb-4 flex flex-col space-y-2">
//               <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
//                 <Button onClick={() => downloadTemplate('student')} className="w-full sm:w-auto text-xs sm:text-sm">
//                   <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Download Template
//                 </Button>
//                 <Button asChild className="w-full sm:w-auto text-xs sm:text-sm">
//                   <label>
//                     <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Upload Excel
//                     <input type="file" className="hidden" onChange={(e) => uploadExcel(e, 'student')} accept=".xlsx, .xls" />
//                   </label>
//                 </Button>
//               </div>
//               <div className="text-sm font-medium">
//                 Total Students: {students.length}
//               </div>
//             </div>
//
//             <div className="rounded-md border overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-xs sm:text-sm">Name</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Email</TableHead>
//                     <TableHead className="text-xs sm:text-sm">USN</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {students.map((student) => (
//                     <TableRow key={student.id}>
//                       <TableCell className="text-xs sm:text-sm">{student.name}</TableCell>
//                       <TableCell className="text-xs sm:text-sm">{student.email}</TableCell>
//                       <TableCell className="text-xs sm:text-sm">{student.usn}</TableCell>
//                       <TableCell>
//                         <Button size="sm" variant="destructive" onClick={() => handleDeleteStudent(student.id)}>
//                           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//
//             <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
//               <Input
//                 placeholder="Name"
//                 value={newStudent.name}
//                 onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//               <Input
//                 placeholder="Email"
//                 value={newStudent.email}
//                 onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//               <Input
//                 placeholder="USN"
//                 value={newStudent.usn}
//                 onChange={(e) => setNewStudent({ ...newStudent, usn: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//             </div>
//             <Button className="mt-4 w-full sm:w-auto text-xs sm:text-sm" onClick={handleAddStudent}>
//               <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add Student
//             </Button>
//           </CardContent>
//         </Card>
//
//         {/* Teachers Section */}
//         <Card className="col-span-1">
//           <CardHeader className="border-b p-4">
//             <CardTitle className="text-lg sm:text-xl">Teacher Management - {params.branchCode} (Semester {params.semesterNo})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-2 sm:p-4">
//             <div className="mb-4 flex flex-col space-y-2">
//               <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
//                 <Button onClick={() => downloadTemplate('teacher')} className="w-full sm:w-auto text-xs sm:text-sm">
//                   <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Download Template
//                 </Button>
//                 <Button asChild className="w-full sm:w-auto text-xs sm:text-sm">
//                   <label>
//                     <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Upload Excel
//                     <input type="file" className="hidden" onChange={(e) => uploadExcel(e, 'teacher')} accept=".xlsx, .xls" />
//                   </label>
//                 </Button>
//               </div>
//               <div className="text-sm font-medium">
//                 Total Teachers: {teachers.length}
//               </div>
//             </div>
//
//             <div className="rounded-md border overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-xs sm:text-sm">Name</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Email</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Initial</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Courses</TableHead>
//                     <TableHead className="text-xs sm:text-sm">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {teachers.map((teacher) => (
//                     <TableRow key={teacher.id}>
//                       <TableCell className="text-xs sm:text-sm">{teacher.name}</TableCell>
//                       <TableCell className="text-xs sm:text-sm">{teacher.email}</TableCell>
//                       <TableCell className="text-xs sm:text-sm">{teacher.initial}</TableCell>
//                       <TableCell className="text-xs sm:text-sm">{teacher.courses}</TableCell>
//                       <TableCell>
//                         <Button size="sm" variant="destructive" onClick={() => handleDeleteTeacher(teacher.id)}>
//                           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//
//             <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
//               <Input
//                 placeholder="Name"
//                 value={newTeacher.name}
//                 onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//               <Input
//                 placeholder="Email"
//                 value={newTeacher.email}
//                 onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//               <Input
//                 placeholder="Initial"
//                 value={newTeacher.initial}
//                 onChange={(e) => setNewTeacher({ ...newTeacher, initial: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//               <Input
//                 placeholder="Courses"
//                 value={newTeacher.courses}
//                 onChange={(e) => setNewTeacher({ ...newTeacher, courses: e.target.value })}
//                 className="text-xs sm:text-sm"
//               />
//             </div>
//             <Button className="mt-4 w-full sm:w-auto text-xs sm:text-sm" onClick={handleAddTeacher}>
//               <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add Teacher
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
//

export default function Manager() {
  return (
    <div>
      <h1 className="text-2xl font-bold m-5">Course Management</h1>
      <CreateCourseForm />
    </div>
  )
}
