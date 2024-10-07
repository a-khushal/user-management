import { teacherBranch } from '@/actions/teacherBranch';
import { fetchCourses } from '@/actions/fetchCourses';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/authStore/auth';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";
import { Appbar } from '../Appbar';

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  const teacherInitial = session.user.initial;
  const branchTeacher = await teacherBranch({ initial: teacherInitial });
  const teacherCourses = await fetchCourses({ initial: teacherInitial });

  return (
    <div className="flex flex-col min-h-screen">
      <div className=''><Appbar /></div>
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
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        {Array.isArray(teacherCourses) ? (
                          <TableBody>
                            {teacherCourses.map((data) => (
                              <TableRow key={data.courseId}>
                                <TableCell>{data.course.title}</TableCell>
                                <TableCell>{data.course.courseId}</TableCell>
                                <TableCell>
                                  <Link href={`/course/${data.courseId}/${payload.branchCode}`} passHref>
                                    <Button variant="outline" size="sm">View Course</Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        ) : <p>An error occurred.</p>}
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

