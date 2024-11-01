"use client"

import SubjectsDashboard from "@/components/student/subjects-dashboard"
import { getStudentAttemptDetails } from "@/actions/saveAttempt"
import { useEffect,useState } from "react"
import { useParams } from "next/navigation"


interface TestDetail {
  id: number
  name:string
  marksObtained: number
  totalMarks: number
  courseId: string
  course: string
}

export default function Page() {
  const {usn}=useParams();
  const [subjects,setSubjects]=useState<TestDetail[]>([]);
  console.log(typeof(usn))
  useEffect(()=>{
    const getData= async ()=>{
      const data=await getStudentAttemptDetails({usn:usn})
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