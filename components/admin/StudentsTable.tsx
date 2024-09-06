'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type students = {
  name: string;
  email: string;
  semester: number;
  usn: string;
  branchCode: string;
}
  
export function StudentsTable({ students }: {
  students: students[] | { error: string }
}) {
  if ('error' in students) {
    return <p>Error: {students.error}</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Email</TableHead>
          <TableHead className="w-[100px]">Semester</TableHead>
          <TableHead className="w-[100px]">USN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.usn}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell>{student.usn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
  