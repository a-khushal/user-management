import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Plus } from "lucide-react";
import { Appbar } from '@/components/Appbar';
import { getServerSession } from 'next-auth';
import { fetchStudents } from '@/actions/teacher/fetchStudents';
import { authOptions } from '@/app/authStore/auth';
import { CreateQuizForm } from '@/components/teacher/CreateQuizForm';
import { fetchQuiz } from '@/actions/teacher/fetchQuiz';
import { DeleteButton } from '@/components/teacher/DeleteQuizButton';


import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const params = context.params;
  return {
    props: {
      params,
    },
  };
};

export default async function CourseDetails({ params }: { params: { courseId: string, branchCode: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role == 'STUDENT' || session.user.role == 'ADMIN') {
    redirect('/');
  }
  const course = params.courseId;
  const branchCode = params.branchCode;
  const initial = session.user?.initial;
  const students = await fetchStudents({ branchCode, teacherInitial: initial || "" });
  const quizzes = await fetchQuiz({ initial, course, branch: branchCode });

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Appbar />
      </header>
      <main className="flex-grow p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="quizzes">
            <TabsList>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

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
                                  <TableHead>Time</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              {Array.isArray(quizzes) ? (
                                <TableBody>
                                  {quizzes.map((quiz) => (
                                    quiz.expired === false ? (
                                      <TableRow key={quiz.id}>
                                        <TableCell className="font-medium">{quiz.title}</TableCell>
                                        <TableCell>{quiz.date.toLocaleDateString()}</TableCell>
                                        <TableCell>{quiz.startTime.toLocaleTimeString()} - {quiz.endTime.toLocaleTimeString()}</TableCell>
                                        <TableCell>{quiz.duration} minutes</TableCell>
                                        <TableCell className="text-right">
                                          <form action={`${branchCode}/edit/${quiz.id}`} method="get">
                                            <Button variant="outline" size="sm">
                                              <Eye className="mr-2 h-4 w-4" />
                                            </Button>
                                          </form>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <DeleteButton id={quiz.id} initial={initial} courseId={course} branch={branchCode}></DeleteButton>
                                        </TableCell>
                                      </TableRow>
                                    ) : null
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
                                  <TableHead>Avg. Score</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              {Array.isArray(quizzes) ? (
                                <TableBody>
                                  {quizzes.map((quiz) => (
                                    quiz.expired === true ? (
                                      <TableRow key={quiz.id}>
                                        <TableCell className="font-medium">{quiz.title}</TableCell>
                                        <TableCell>{quiz.date.toLocaleDateString()}</TableCell>
                                        <TableCell>0.0</TableCell>
                                        <TableCell>{quiz.duration}</TableCell>
                                        <TableCell>
                                          <form action="/view-performance">
                                            <input type="hidden" name="quizId" value={quiz.id} />
                                            <Button variant="outline" size="sm">
                                              <Eye className="mr-2 h-4 w-4" />
                                              View
                                            </Button>
                                          </form>
                                        </TableCell>
                                      </TableRow>
                                    ) : null
                                  ))}
                                </TableBody>
                              ) : <p>An error occurred</p>}
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

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
          </Tabs>
        </div>
      </main>
    </div>
  );
}



// const CoursePage = ({ params }: any) => {
//     return (
//     <div>
//       <h1>Course ID: {courseId}</h1>
//     </div>
//   );
// };
//
// export default CoursePage;
//
