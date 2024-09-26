'use client'
import AddBranchForm from "./AddBranchForm";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";
import { Pencil, RefreshCw, UserPlus, Users } from "lucide-react";
import { allStudents } from "@/actions/allStudents";

export interface Student {
  name: string,
  email: string,
  usn: string,
  semester: number,
  branchCode: string,
}

export default function AllBranches({ branches }: {
  branches: {
    id: number,
    code: string,
    name: string,
  }[] | undefined
}) {
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false)
  const [students, setStudents] = useState<Student[] | { error: string }>([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    setStudents([]);

    const getStudents = async () => {
      const students = await allStudents({ code });
      setStudents(students);
    }

    getStudents();

  }, [code])

  const handleAddStudent = () => {
    setIsAddingStudent(true)
    // Simulating add student process
    setTimeout(() => setIsAddingStudent(false), 2000)
  }

  const handleUpdateStudent = () => {
    setIsUpdatingStudent(true)
    // Simulating update student process
    setTimeout(() => setIsUpdatingStudent(false), 2000)
  }
  return (
    <main className="flex-grow p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">College Branches</h2>
          <AddBranchForm />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map((branch) => (
            <Dialog key={branch.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{branch.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <span>{branch.code} Students</span>
                    </div>
                    {/* <div className="flex items-center mb-2"> */}
                    {/*   <Users className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                    {/*   <span>{branch.students} Students</span> */}
                    {/* </div> */}
                    {/* <div className="flex items-center mb-2"> */}
                    {/*   <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                    {/*   <span>{branch.courses} Courses</span> */}
                    {/* </div> */}
                    {/* <div className="flex items-center"> */}
                    {/*   <MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                    {/*   <span>{branch.location}</span> */}
                    {/* </div> */}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Students</Button>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{branch.name} - Student List</DialogTitle>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mb-4">
                  <Button onClick={handleAddStudent} disabled={isAddingStudent}>
                    {isAddingStudent ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    Add Student
                  </Button>
                  <Button onClick={handleUpdateStudent} disabled={isUpdatingStudent}>
                    {isUpdatingStudent ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="mr-2 h-4 w-4" />
                    )}
                    Update Students
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>USN</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!students.error ? students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>{student.usn}</TableCell>
                      </TableRow>
                    )) : students.error}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </main >
  );
}
