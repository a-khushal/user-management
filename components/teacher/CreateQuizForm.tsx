"use client"
import { authOptions } from "@/app/authStore/auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload } from "lucide-react"
import { createQuiz } from "@/actions/teacher/createQuiz"
import { title } from "process"
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { Teacher } from "@prisma/client"
import { toast, useToast } from "@/hooks/use-toast"
import { date } from "zod"

interface props{
  courseId:string,
  branch:string
}


export function CreateQuizForm({courseId,branch}:props) {
  const session = useSession();
  const datetime=new Date();
  const {toast}=useToast();
  const [quizName, setQuizName] = useState("")
  const [quizDate, setQuizDate] = useState("")
  const [quizStartTime, setQuizSTime] = useState("")
  const [quizEndTime,setQuizETime]= useState("")
  const [fileName, setFileName] = useState("")
  const handleDownloadSample = () => {
    // Logic to download sample Word file
    console.log("Downloading sample Word file")
    // In a real application, you would trigger the file download here
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const temp = ({date}:{date:Date}) =>{
    console.log(date.getTime())
  }
  const handleClick = async () => {
      const dateTime = `${quizDate}T${quizStartTime}:00`;
      const quizdate = new Date(quizDate);
      const stime = new Date(dateTime);
      const quiztime=`${quizDate}T${quizEndTime}:00`;
      const etime=new Date(quiztime);
      //@ts-ignore
      const teacher: Teacher['initial'] = session.data?.user?.initial;
      const result = await createQuiz({
        title: quizName,
        date: quizdate,
        startTime: stime,
        endTime:etime,
        totalQuestions: 10,
        teacher: teacher,
        course:courseId,
        branch:branch
      })

      if (result&&result.message) {
        toast({
          title:result.message,
        })
      } else if(result.error) {
        toast({
          title:result.error,
          variant:"destructive",
        })
      }
    
  };

  return (
    <form action={() => { }} className="space-y-4">
      <div>
        {/* {JSON.stringify(session.data?.user?.initial)} */}
        <Label htmlFor="quizName">Quiz Title</Label>
        <Input
          id="quizName"
          name="quizName"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Enter quiz name"
          required
        />
      </div>
      <div>
        <Label htmlFor="quizDate">Quiz Date</Label>
        <Input
          id="quizDate"
          name="quizDate"
          type="date"
          value={quizDate}
          min={`${datetime.toISOString().split("T")[0]}`}
          onChange={(e) => setQuizDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="quizStartTime">Quiz start Time</Label>
        <Input
          id="quizStartTime"
          name="quizStartTime"
          type="time"
          value={quizStartTime}
          onChange={(e) => setQuizSTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="quizEndTime">Quiz End Time</Label>
        <Input
          id="quizStartTime"
          name="quizStartTime"
          type="time"
          value={quizEndTime}
          onChange={(e) => setQuizETime(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Button type="button" variant="outline" onClick={handleDownloadSample} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Sample Word File
        </Button>
        <Label htmlFor="upload-file" className="w-full">
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {fileName ? fileName : "Upload Quiz Word File"}
          </Button>
          <Input
            id="upload-file"
            name="quizFile"
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      <Button className="w-full" onClick={handleClick}>
        Create Quiz
      </Button>
    </form>
  )
}
