import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Trophy, TrendingUp } from "lucide-react"
interface Subject{
  name:string
  score:number
}
interface TestResult {
  id: number
  name: string
  score: number
  totalMarks: number
  date: string
}

interface DashboardProps {
  subjectId:string
  subject: string
  overallScore: number
  testResults: TestResult[]
}

const Component: React.FC<DashboardProps> = ({ 
  subject = "Mathematics", 
  overallScore = 85, 
  testResults = [
    { id: 1, name: "Algebra Quiz", score: 18, totalMarks: 20, date: "2023-09-15" },
    { id: 2, name: "Geometry Test", score: 45, totalMarks: 50, date: "2023-10-02" },
    { id: 3, name: "Trigonometry Exam", score: 85, totalMarks: 100, date: "2023-10-20" },
    { id: 4, name: "Calculus Mid-term", score: 78, totalMarks: 100, date: "2023-11-05" },
  ]
}) => {
  const averageScore = Math.round(testResults.reduce((acc, test) => acc + (test.score / test.totalMarks) * 100, 0) / testResults.length)
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">{subject} Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
            <Progress value={overallScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <Progress value={averageScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResults.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>{test.score} / {test.totalMarks}</TableCell>
                  <TableCell>{Math.round((test.score / test.totalMarks) * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Component