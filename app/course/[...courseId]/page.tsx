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
import { Edit, Eye, Pencil, Plus } from "lucide-react";
import { Appbar } from '@/components/Appbar';
import { getServerSession } from 'next-auth';
import { fetchStudents } from '@/actions/teacher/fetchStudents';
import { authOptions } from '@/app/authStore/auth';
import { CreateQuizForm } from '@/components/teacher/CreateQuizForm';
import { fetchQuiz } from '@/actions/teacher/fetchQuiz';

const previousQuizzes = [
  { id: 1, name: "Math Quiz", date: "2023-05-15", participants: 25, avgScore: 85 },
  { id: 2, name: "Science Quiz", date: "2023-05-20", participants: 30, avgScore: 78 },
  { id: 5, name: "Geography Quiz", date: "2023-05-25", participants: 22, avgScore: 82 },
  { id: 7, name: "Literature Quiz", date: "2023-05-30", participants: 28, avgScore: 76 },
  { id: 8, name: "Music Quiz", date: "2023-06-01", participants: 20, avgScore: 88 },
  { id: 11, name: "Art History Quiz", date: "2023-06-03", participants: 18, avgScore: 79 },
  { id: 12, name: "Computer Science Quiz", date: "2023-06-05", participants: 35, avgScore: 92 },
]

// const upcomingQuizzes = [
//   // { id: 3, name: "History Quiz", date: "2023-06-05", time: "14:00", participants: 20 },
//   // { id: 4, name: "English Quiz", date: "2023-06-10", time: "10:30", participants: 28 },
//   // { id: 6, name: "Physics Quiz", date: "2023-06-15", time: "15:45", participants: 18 },
//   // { id: 9, name: "Chemistry Quiz", date: "2023-06-20", time: "11:00", participants: 25 },
//   // { id: 10, name: "Biology Quiz", date: "2023-06-25", time: "13:30", participants: 22 },
//   // { id: 13, name: "Economics Quiz", date: "2023-06-30", time: "09:00", participants: 30 },
//   // { id: 14, name: "Psychology Quiz", date: "2023-07-05", time: "14:15", participants: 27 },
// ]


export default async function CourseDetails({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role == 'STUDENT' || session.user.role == 'ADMIN') {
    redirect('/');
  }
  const course = params.courseId[0];
  const branchCode = params.courseId[1];
  const initial = session.user?.initial;
  const students = await fetchStudents({ branchCode, teacherInitial: initial || "" });
  const upcomingQuizzes = await fetchQuiz({ initial, course, branch: branchCode });
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
              <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-primary">Quiz Manager</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Quiz
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Quiz</DialogTitle>
                      </DialogHeader>
                      <CreateQuizForm courseId={course} branch={branchCode} />
                    </DialogContent>
                  </Dialog>
                </div>

                <Tabs defaultValue="upcoming" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming Quizzes</TabsTrigger>
                    <TabsTrigger value="previous">Previous Quizzes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Quizzes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                          <div className="max-h-[400px] overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                  <TableHead className="w-[200px]">Quiz Name</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Active Time</TableHead>
                                  {/* <TableHead>Participants</TableHead> */}
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              {Array.isArray(upcomingQuizzes) ? (
                                <TableBody>
                                  {upcomingQuizzes.map((quiz) => (
                                    <TableRow key={quiz.id}>
                                      <TableCell className="font-medium">{quiz.title}</TableCell>
                                      <TableCell>{quiz.date.toLocaleDateString()}</TableCell>
                                      <TableCell>{quiz.startTime.toLocaleTimeString()} - {quiz.endTime.toLocaleTimeString()}</TableCell>
                                      {/* <TableCell>{quiz.participants}</TableCell> */}
                                      <TableCell className="text-right">
                                        <form action="/edit-quiz">
                                          <input type="hidden" name="quizId" value={quiz.id} />
                                          <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" /><span className='mr-2'>View</span>
                                            / <Pencil className='mr-2 h-3 w-4' /><span>Edit</span>
                                          </Button>
                                        </form>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              ) : <p>An error occurred</p>}
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="previous">
                    <Card>
                      <CardHeader>
                        <CardTitle>Previous Quizzes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                          <div className="max-h-[400px] overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                  <TableHead className="w-[200px]">Quiz Name</TableHead>
                                  <TableHead>Date</TableHead>
                                  {/* <TableHead>Participants</TableHead> */}
                                  <TableHead>Avg. Score</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {previousQuizzes.map((quiz) => (
                                  <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.name}</TableCell>
                                    <TableCell>{quiz.date}</TableCell>
                                    {/* <TableCell>{quiz.participants}</TableCell> */}
                                    <TableCell>{quiz.avgScore}%</TableCell>
                                    <TableCell className="text-right">
                                      <form action="/view-performance">
                                        <input type="hidden" name="quizId" value={quiz.id} />
                                        <Button variant="outline" size="sm">
                                          <Eye className="mr-2 h-4 w-4" />
                                          View
                                        </Button>
                                      </form>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

