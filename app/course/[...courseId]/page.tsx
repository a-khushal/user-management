import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Plus } from "lucide-react";
import { Appbar } from '@/components/Appbar';
import { getServerSession } from 'next-auth';
import { fetchStudents } from '@/actions/teacher/fetchStudents';
import { authOptions } from '@/app/authStore/auth';

interface FetchedStudents {
  usn: string;
  teacherInitial: string;
  student: {
    name: string,
    email: string,
    usn: string,
  }
}

const quizzes = [
  { id: 1, name: "Quiz 1: Variables and Data Types", date: "2023-05-01" },
  { id: 2, name: "Quiz 2: Control Structures", date: "2023-05-15" },
  { id: 3, name: "Quiz 3: Functions and Modules", date: "2023-05-29" },
  { id: 4, name: "Quiz 4: Object-Oriented Programming", date: "2023-06-12" },
  { id: 5, name: "Quiz 5: Data Structures", date: "2023-06-26" },
  { id: 6, name: "Quiz 6: Algorithms", date: "2023-07-10" },
  { id: 7, name: "Quiz 7: File Handling", date: "2023-07-24" },
  { id: 8, name: "Quiz 8: Exception Handling", date: "2023-08-07" },
];

export default async function CourseDetails({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role == 'STUDENT' || session.user.role == 'ADMIN') {
    redirect('/');
  }

  const branchCode = params.courseId[1];
  const initial = session.user?.initial;

  const students = await fetchStudents({ branchCode, teacherInitial: initial || "" });

  const handleCreateQuiz = async (newQuizName: string, newQuizDate: string) => {
    // Server-side action to handle quiz creation
    console.log("Creating new quiz:", { name: newQuizName, date: newQuizDate });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Appbar />
      </header>
      <main className="flex-grow p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>USN</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(students.payload) ? (
                        students.payload.map((data) => (
                          <TableRow key={data.usn}>
                            <TableCell>{data.student.name}</TableCell>
                            <TableCell>{data.student.email}</TableCell>
                            <TableCell>{data.student.usn}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Performance
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{data.student.name} Quiz Performance</DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Quiz</TableHead>
                                          <TableHead>Date</TableHead>
                                          <TableHead>Score</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      {/* Display quiz performance */}
                                    </Table>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <span>Error while fetching the data</span>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <CardTitle>Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Create New Quiz</h3>
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        <Label htmlFor="quizName">Quiz Name</Label>
                        <Input id="quizName" placeholder="Enter quiz name" />
                      </div>
                      <div>
                        <Label htmlFor="quizDate">Quiz Date</Label>
                        <Input id="quizDate" type="date" />
                      </div>
                      <Button className="mt-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quiz
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell>{quiz.name}</TableCell>
                          <TableCell>{quiz.date}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Results</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

