'use client'

import { useEffect, useState } from 'react'
import { redirect, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Plus, Eye } from "lucide-react"
import { Appbar } from '@/components/Appbar'
import { useSession } from 'next-auth/react'
import { fetchStudents } from '@/actions/teacher/fetchStudents'

// Mock data (replace with actual API calls in a real application)
const students = [
  { id: 1, name: "John Doe", email: "john@example.com", usn: "CS001" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", usn: "CS002" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", usn: "CS003" },
]

const quizzes = [
  { id: 1, name: "Quiz 1: Variables and Data Types", date: "2023-05-01" },
  { id: 2, name: "Quiz 2: Control Structures", date: "2023-05-15" },
  { id: 3, name: "Quiz 3: Functions and Modules", date: "2023-05-29" },
  { id: 4, name: "Quiz 4: Object-Oriented Programming", date: "2023-06-12" },
  { id: 5, name: "Quiz 5: Data Structures", date: "2023-06-26" },
  { id: 6, name: "Quiz 6: Algorithms", date: "2023-07-10" },
  { id: 7, name: "Quiz 7: File Handling", date: "2023-07-24" },
  { id: 8, name: "Quiz 8: Exception Handling", date: "2023-08-07" },
]

const quizResults = [
  { id: 1, studentId: 1, quizId: 1, score: 85 },
  { id: 2, studentId: 1, quizId: 2, score: 92 },
  { id: 3, studentId: 1, quizId: 3, score: 88 },
  { id: 4, studentId: 1, quizId: 4, score: 90 },
  { id: 5, studentId: 1, quizId: 5, score: 95 },
  { id: 6, studentId: 1, quizId: 6, score: 87 },
  { id: 7, studentId: 1, quizId: 7, score: 93 },
  { id: 8, studentId: 1, quizId: 8, score: 91 },
  { id: 9, studentId: 2, quizId: 1, score: 78 },
  { id: 10, studentId: 2, quizId: 2, score: 85 },
  { id: 11, studentId: 2, quizId: 3, score: 90 },
  { id: 12, studentId: 2, quizId: 4, score: 82 },
  { id: 13, studentId: 2, quizId: 5, score: 88 },
  { id: 14, studentId: 2, quizId: 6, score: 92 },
  { id: 15, studentId: 2, quizId: 7, score: 86 },
  { id: 16, studentId: 2, quizId: 8, score: 89 },
  { id: 17, studentId: 3, quizId: 1, score: 92 },
  { id: 18, studentId: 3, quizId: 2, score: 95 },
  { id: 19, studentId: 3, quizId: 3, score: 98 },
  { id: 20, studentId: 3, quizId: 4, score: 94 },
  { id: 21, studentId: 3, quizId: 5, score: 97 },
  { id: 22, studentId: 3, quizId: 6, score: 96 },
  { id: 23, studentId: 3, quizId: 7, score: 99 },
  { id: 24, studentId: 3, quizId: 8, score: 93 },
  { id: 100, studentId: 1, quizId: 1, score: 85 },
  { id: 122, studentId: 1, quizId: 2, score: 92 },
  { id: 113, studentId: 1, quizId: 3, score: 88 },
  { id: 114, studentId: 1, quizId: 4, score: 90 },
  { id: 115, studentId: 1, quizId: 5, score: 95 },
  { id: 116, studentId: 1, quizId: 6, score: 87 },
  { id: 117, studentId: 1, quizId: 7, score: 93 },
  { id: 118, studentId: 1, quizId: 8, score: 91 },
]

export default function CourseDetails() {
  const session = useSession();
  const params = useParams()
  const branchCode = params.courseId[1];
  const [newQuizName, setNewQuizName] = useState("")
  const [newQuizDate, setNewQuizDate] = useState("");

  // @ts-ignore
  const initial = session.data?.user?.initial;

  useEffect(() => {
    fetchStudents({ branchCode: branchCode, teacherInitial: initial || "" })
  })

  const handleCreateQuiz = () => {
    // In a real application, you would send this data to your backend
    console.log("Creating new quiz:", { name: newQuizName, date: newQuizDate })
    // Reset form
    setNewQuizName("")
    setNewQuizDate("")
  }

  if (session.status === 'unauthenticated') {
    redirect("/")
  }
  // @ts-ignore
  else if (session.data && (session.data.user?.role === 'teacher' || session.data.user?.role === 'TEACHER')) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Appbar />
        </header>
        {JSON.stringify(session)}
        <div></div>
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
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.usn}</TableCell>
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
                                    <DialogTitle>{student.name}'s Quiz Performance</DialogTitle>
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
                                      <TableBody>
                                        {quizResults
                                          .filter((result) => result.studentId === student.id)
                                          .map((result) => {
                                            const quiz = quizzes.find((q) => q.id === result.quizId)
                                            return (
                                              <TableRow key={result.id}>
                                                <TableCell>{quiz?.name}</TableCell>
                                                <TableCell>{quiz?.date}</TableCell>
                                                <TableCell>{result.score}%</TableCell>
                                              </TableRow>
                                            )
                                          })}
                                      </TableBody>
                                    </Table>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
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
                          <Input
                            id="quizName"
                            value={newQuizName}
                            onChange={(e) => setNewQuizName(e.target.value)}
                            placeholder="Enter quiz name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quizDate">Quiz Date</Label>
                          <Input
                            id="quizDate"
                            type="date"
                            value={newQuizDate}
                            onChange={(e) => setNewQuizDate(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreateQuiz} className="mt-auto">
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
    )
  }

  else {
    redirect("/")
  }
}
