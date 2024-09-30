'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, BookOpen, MapPin } from "lucide-react"

// Mock data for branches and courses (same as before)
const branches = [
  { id: 1, name: "Computer Science", students: 450, courses: 15, location: "North Campus" },
  { id: 2, name: "Electrical Engineering", students: 380, courses: 12, location: "South Campus" },
  { id: 3, name: "Mechanical Engineering", students: 420, courses: 14, location: "Main Campus" },
]

const courses = [
  { id: 1, branchId: 1, name: "Introduction to Programming", code: "CS101", students: 60 },
  { id: 2, branchId: 1, name: "Data Structures", code: "CS201", students: 55 },
  { id: 3, branchId: 2, name: "Circuit Theory", code: "EE101", students: 50 },
  { id: 4, branchId: 2, name: "Digital Electronics", code: "EE201", students: 45 },
  { id: 5, branchId: 3, name: "Thermodynamics", code: "ME101", students: 58 },
  { id: 6, branchId: 3, name: "Fluid Mechanics", code: "ME201", students: 52 },
]

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      </header>
      <main className="flex-grow p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Your Branches</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Dialog key={branch.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{branch.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{branch.students} Students</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{branch.courses} Courses</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{branch.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{branch.name} - Courses</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.filter(course => course.branchId === branch.id).map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.code}</TableCell>
                            <TableCell>{course.students}</TableCell>
                            <TableCell>
                              <Link href={`/teacher-dashboard/course/${course.id}`} passHref>
                                <Button variant="outline" size="sm">View Course</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
