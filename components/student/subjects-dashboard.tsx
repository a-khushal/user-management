"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface TestDetail {
  id: number
  name: string
  marksObtained: number
  totalMarks: number
  courseId: string
  course: string
}

interface SubjectData {
  name: string
  courseId: string
  tests: TestDetail[]
  averageScore: number
}

interface TestDetailsDashboardProps {
  testDetails: TestDetail[]
}

export default function TestDetailsDashboard({ testDetails }: TestDetailsDashboardProps) {
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const [calculatedData, setCalculatedData] = useState<{
    subjectData: SubjectData[],
    overallAverage: number,
    totalTests: number,
    totalSubjects: number
  } | null>(null)

  useEffect(() => {
    if (!testDetails || testDetails.length === 0) {
      setCalculatedData({
        subjectData: [],
        overallAverage: 0,
        totalTests: 0,
        totalSubjects: 0
      })
      setIsInitialized(true)
      return
    }

    const calculateData = () => {
      try {
        const subjectMap = new Map<string, TestDetail[]>()
        testDetails.forEach(test => {
          if (!subjectMap.has(test.course)) {
            subjectMap.set(test.course, [])
          }
          subjectMap.get(test.course)!.push(test)
        })

        const calculatedSubjectData = Array.from(subjectMap.entries()).map(([name, tests]) => ({
          name,
          courseId: tests[0].courseId,
          tests,
          averageScore: tests.reduce((sum, test) => 
            sum + (test.marksObtained / test.totalMarks) * 10, 0
          ) / tests.length
        }))

        const validSubjects = calculatedSubjectData.filter(subject => 
          !isNaN(subject.averageScore) && isFinite(subject.averageScore)
        )

        const calculatedOverallAverage = validSubjects.length > 0
          ? validSubjects.reduce((sum, subject) => sum + subject.averageScore, 0) / validSubjects.length
          : 0

        setCalculatedData({
          subjectData: calculatedSubjectData,
          overallAverage: calculatedOverallAverage,
          totalTests: testDetails.length,
          totalSubjects: calculatedSubjectData.length
        })
      } catch (error) {
        console.error('Error calculating data:', error)
        setCalculatedData({
          subjectData: [],
          overallAverage: 0,
          totalTests: 0,
          totalSubjects: 0
        })
      }
      setIsInitialized(true)
    }

    // Calculate immediately, no artificial delay
    calculateData()
  }, [testDetails])

  const getScoreColor = (score: number) => {
    if (!isFinite(score) || isNaN(score)) return "text-muted-foreground"
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (!isFinite(score) || isNaN(score)) return "No data available"
    if (score >= 7) return "Good performance!"
    if (score >= 5) return "Average performance. Room for improvement."
    return "Needs improvement. Consider additional study."
  }

  const handleViewDetails = (testId: number) => {
    router.push(`/response/${testId}`)
  }

  // Show loading state until initialization is complete
  if (!isInitialized || !calculatedData) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-neutral-600">Test Details Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  // Show empty state if no data
  if (calculatedData.totalTests === 0) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-neutral-600">Test Details Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-neutral-600">Test Details Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Subjects:</span>
              <span className="font-medium">{calculatedData.totalSubjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Tests:</span>
              <span className="font-medium">{calculatedData.totalTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Average Score:</span>
              <span className={`font-medium ${getScoreColor(calculatedData.overallAverage)}`}>
                {calculatedData.overallAverage.toFixed(2)}
              </span>
            </div>
            <div className={`text-center font-medium ${getScoreColor(calculatedData.overallAverage)}`}>
              {getScoreMessage(calculatedData.overallAverage)}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full">
        {calculatedData.subjectData.map((subject, index) => (
          <AccordionItem value={`subject-${index}`} key={index}>
            <AccordionTrigger>
              <div className="flex justify-between w-full pr-4">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">Course ID: {subject.courseId}</span>
                </div>
                <span className={getScoreColor(subject.averageScore)}>
                  Avg: {subject.averageScore.toFixed(2)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className={`text-center font-medium mb-4 ${getScoreColor(subject.averageScore)}`}>
                    {getScoreMessage(subject.averageScore)}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead className="text-right">Maximum Marks</TableHead>
                        <TableHead className="text-right">Obtained Marks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subject.tests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.name}</TableCell>
                          <TableCell className="text-right">{test.totalMarks}</TableCell>
                          <TableCell className="text-right">{test.marksObtained}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(test.id)}
                            >
                              View Details
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}