'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getStudentAttemptDetails } from "@/actions/saveAttempt"
import SubjectsDashboard from "@/components/student/subjects-dashboard"
import { ThemeProvider } from "next-themes"

interface TestDetail {
  id: number
  name: string
  marksObtained: number
  totalMarks: number
  courseId: string
  course: string
}

export default function Page() {
  const searchParams = useSearchParams()
  const usn = searchParams.get('usn')
  const [subjects, setSubjects] = useState<TestDetail[]>([])

  useEffect(() => {
    const getData = async () => {
      if (!usn) return
      const data = await getStudentAttemptDetails({ usn })
      if (data) {
        setSubjects(data as TestDetail[])
      }
    }
    getData()
  }, [usn])

  if (!usn) return null

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <SubjectsDashboard testDetails={subjects} usn={usn} />
      </div>
    </ThemeProvider>
  )
}