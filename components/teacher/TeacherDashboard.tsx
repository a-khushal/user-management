'use client'

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BookOpen, MapPin } from "lucide-react";
import { teacherBranch } from '@/actions/teacherBranch';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BranchTeacher } from '@/types/branchTeacher';
import { FullLoader } from '../ui/full-loader';
import { fetchCourses } from '@/actions/fetchCourses';
import { CourseTeacher } from '@/types/courseTeacher';

const courses = [
  { id: 1, branchId: 1, name: "Introduction to Programming", code: "CS101", students: 60 },
  { id: 2, branchId: 1, name: "Data Structures", code: "CS201", students: 55 },
  { id: 3, branchId: 2, name: "Circuit Theory", code: "EE101", students: 50 },
  { id: 4, branchId: 2, name: "Digital Electronics", code: "EE201", students: 45 },
  { id: 5, branchId: 3, name: "Thermodynamics", code: "ME101", students: 58 },
  { id: 6, branchId: 3, name: "Fluid Mechanics", code: "ME201", students: 52 },
];

export default function TeacherDashboard() {
  const [branchTeacher, setBranchTeacher] = useState<BranchTeacher[] | { error: string }>();
  const [teacherCourses, setTeacherCourses] = useState<CourseTeacher[] | { error: string }>();
  const [loading, setLoading] = useState(true);
  const session = useSession();
  // @ts-ignore
  const teacherInitial = session.data?.user?.initial;

  useEffect(() => {
    async function main() {
      const v1 = await teacherBranch({ initial: teacherInitial });
      setBranchTeacher(v1.payload);
      setLoading(false);
    }

    main();
  }, [teacherInitial]);

  useEffect(() => {
    async function main() {
      const v2 = await fetchCourses({ initial: teacherInitial });
      setTeacherCourses(v2.payload);
    }

    main();
  }, [teacherInitial]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      </header>
      {loading ? <FullLoader /> : (
        <main className="flex-grow p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Your Branches</h2>
            {branchTeacher && !Array.isArray(branchTeacher) && <p>{branchTeacher.error}</p>}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(branchTeacher) ? (
                branchTeacher.map((payload) => (
                  <Dialog key={payload.branchCode}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>{payload.branch.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{payload.branch.code}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{payload.branchCode} - Courses</DialogTitle>
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
                          {Array.isArray(teacherCourses) ? (
                            <TableBody>
                              {teacherCourses.map((payload) => (
                                <TableRow key={payload.courseId}>
                                  <TableCell>{payload.course.title}</TableCell>
                                  <TableCell>{payload.course.courseId}</TableCell>
                                  <TableCell>{50}</TableCell>
                                  <TableCell>
                                    <Link href={`/teacher-dashboard/course/${payload.courseId}`} passHref>
                                      <Button variant="outline" size="sm">View Course</Button>
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          ) : <p>An error occured.</p>}
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <p>An error occured while fetching the data.</p>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

