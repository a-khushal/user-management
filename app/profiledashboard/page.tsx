"use client"

import SubjectsDashboard from "@/components/student/subjects-dashboard"
import { getStudentAttemptDetails } from "@/actions/saveAttempt"
import { useEffect,useState } from "react"
const sampleData = [
  { id: "CS241AT", name: "Discrete Mathematics", score: 85, totaltests: 10, date: "2023-11-15" },
  { id: "CY245AT", name: "Computer Networks ", score: 78, totaltests: 8, date: "2023-11-10" },
  { id: "CS344AI", name: "IOT and Embedded computing", score: 92, totaltests: 9, date: "2023-11-18" },
  { id: "HS248XT", name: "Universal Human Values", score: 88, totaltests: 7, date: "2023-11-12" }
]


interface TestDetail {
  id: number
  name:string
  marksObtained: number
  totalMarks: number
  courseId: string
  course: string
}

export default function Page() {
  const [subjects,setSubjects]=useState<TestDetail[]>([]);
  useEffect(()=>{
    const getData= async ()=>{
      const data=await getStudentAttemptDetails({usn:"fjdaslkhf2"})
      console.log(data)
      if(data){
        setSubjects(data as TestDetail[]);
      }
    }
    getData()
  },[])
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <SubjectsDashboard testDetails={subjects} />
    </div>
  )
}