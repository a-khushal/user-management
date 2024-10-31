import FetchAllCourses from "@/actions/admin/FetchAllCourses";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Course = {
  id: string;
  name: string;
}

export default async function Component({semester, branchCode}: {
  semester: string,
  branchCode: string,
}) {
  const sem = parseInt(semester)
  const val = await FetchAllCourses({ semester: sem, branchCode })

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Course List</h2>
      <ScrollArea className="h-[300px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Course ID</TableHead>
              <TableHead>Course Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {val.courses?.map((course) => (
              <TableRow key={course.courseId}>
                <TableCell className="font-mono max-w-[300px]">{course.courseId}</TableCell>
                <TableCell className="truncate max-w-[300px]" title={course.title}>
                  {course.title}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}