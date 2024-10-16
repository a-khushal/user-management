'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { allStudents } from "@/actions/allStudents";
import AddBranchForm from "./AddBranchForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from 'next/link'

export interface Student {
  name: string,
  email: string,
  usn: string,
  semester: number,
  branchCode: string,
}

export default function AllBranches({ branches }: {
  branches: {
    id: number,
    code: string,
    name: string,
  }[] | undefined
}) {
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState("")
  const fileInputRef = useRef(null)
  const [students, setStudents] = useState<Student[] | { error: string }>();
  const [code, setCode] = useState("");

  const handleDownloadTemplate = () => {
    window.location.href = "/admin/addnewstudents.xls";
    // setIsProcessing(true)
    // setProcessingType(type)
    // setTimeout(() => {
    //   setIsProcessing(false)
    //   setProcessingType("")
    //   alert(`${type} template downloaded successfully!`)
    // }, 2000)
  }

  useEffect(() => {
    setStudents([]);

    const getStudents = async () => {
      const students = await allStudents({ code });
      setStudents(students);
    }

    getStudents();

  }, [code]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">College Branches</h2>
            {/* <Button> */}
            {/*   <PlusCircle className="mr-2 h-4 w-4" /> Add New Branch */}
            {/* </Button> */}
            <AddBranchForm />
          </div>
          {branches?.length === 0 ? (
            <div className="mt-48 h-full relative w-full flex justify-center items-center">
              No branches have been created, consider creating one
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {branches?.map((branch) => (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:cursor-default">
                  <CardHeader>
                    <CardTitle>{branch.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{branch.code}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`${semester}/${branch.code}`}>
                      <Button variant="outline" className="w-full">View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main >
    </div >
  );
}
