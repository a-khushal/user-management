"use client"

import SubjectsDashboard from "@/components/student/subjects-dashboard"

const sampleData = [
  { id: "CS241AT", name: "Discrete Mathematics", score: 85, totaltests: 10, date: "2023-11-15" },
  { id: "CY245AT", name: "Computer Networks ", score: 78, totaltests: 8, date: "2023-11-10" },
  { id: "CS344AI", name: "IOT and Embedded computing", score: 92, totaltests: 9, date: "2023-11-18" },
  { id: "HS248XT", name: "Universal Human Values", score: 88, totaltests: 7, date: "2023-11-12" }
]

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <SubjectsDashboard subjects={sampleData} />
    </div>
  )
}