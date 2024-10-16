import Link from 'next/link'
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function AllSemesters() {
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select a Semester</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {semesters.map((semester) => (
          <Link href={`/semester/${semester}`} key={semester} passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-center">Semester {semester}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
