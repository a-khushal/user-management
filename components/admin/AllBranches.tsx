'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react";
import { BookOpen, Download, MapPin, Pencil, PlusCircle, RefreshCw, Upload, UserPlus, Users } from "lucide-react";
import { allStudents } from "@/actions/allStudents";

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

  const handleFileUpload = (event: any, type: any) => {
    const file = event.target.files[0]
    if (file) {
      // In a real application, you would process the file here
      setIsProcessing(true)
      setProcessingType(type)
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingType("")
        alert(`${type} completed successfully!`)
      }, 2000)
    }
  }

  const triggerFileInput = (type: any) => {
    setProcessingType(type)
    // @ts-ignore
    fileInputRef.current.click()
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
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Branch
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches?.map((branch) => (
              <Dialog key={branch.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{branch.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <div className="flex items-center mb-2"> */}
                      {/*   <Users className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                      {/*   <span>{branch.students} Students</span> */}
                      {/* </div> */}
                      <div className="flex items-center mb-2">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{branch.code}</span>
                      </div>
                      {/* <div className="flex items-center"> */}
                      {/*   <MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                      {/*   <span>{branch.location}</span> */}
                      {/* </div> */}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setCode(branch.code)}>View Students</Button>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{branch.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Add Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Download the template, fill it with student data, and upload to add new students.
                          </p>
                          <div className="flex flex-col space-y-2">
                            <Button onClick={() => handleDownloadTemplate()}>
                              {/* {isProcessing && processingType === "Add" ? ( */}
                              {/*   <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> */}
                              {/* ) : ( */}
                              <Download className="mr-2 h-4 w-4" />
                              {/* )} */}
                              Download Template
                            </Button>
                            <Button onClick={() => triggerFileInput("Add")} disabled={isProcessing}>
                              {isProcessing && processingType === "Add" ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Upload Filled Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Update Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Download the current student data, update it, and upload to apply changes.
                          </p>
                          <div className="flex flex-col space-y-2">
                            <Button onClick={() => handleDownloadTemplate()} disabled={isProcessing}>
                              {isProcessing && processingType === "Update" ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              Download Current Data
                            </Button>
                            <Button onClick={() => triggerFileInput("Update")} disabled={isProcessing}>
                              {isProcessing && processingType === "Update" ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Upload Updated Data
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>USN</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(students) ? (
                          students.map((student) => (
                            <TableRow key={student.usn}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.semester}</TableCell>
                              <TableCell>{student.usn}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>{students?.error}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </main >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, processingType)}
        accept=".xlsx,.xls"
      />
    </div >
  );
}
