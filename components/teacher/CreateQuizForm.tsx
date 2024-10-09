"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Option, OptionIcon, Upload } from "lucide-react"
import { createQuiz } from "@/actions/teacher/createQuiz"
import { useSession } from "next-auth/react"
import { Teacher } from "@prisma/client"
import { toast, useToast } from "@/hooks/use-toast"
import mammoth from 'mammoth';
import { date } from "zod"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Abel } from "next/font/google"

interface props {
  courseId: string,
  branch: string
}

interface Option {
  optionText: string,
  optionMark: string,
}

export function CreateQuizForm({ courseId, branch }: props) {
  const session = useSession();
  const datetime = new Date();
  const { toast } = useToast();
  const [quizName, setQuizName] = useState("")
  const [quizDate, setQuizDate] = useState("")
  const [quizStartTime, setQuizSTime] = useState("")
  const [quizEndTime, setQuizETime] = useState("")
  const [fileName, setFileName] = useState("")

  const handleDownloadSample = () => {
    window.location.href = "/teacher/sampleWordQuizTemplate.docx";
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      const questions = text.split(/Question \d+/).slice(1); // Split and skip the first element
      const quizData: any = [];

      questions.forEach((question) => {
        const lines = question.trim().split('\n').filter(line => line.trim() !== '');

        const questionObj = {
          questionText: '',
          defaultMark: '',
          numberOfOptions: 0,
          options: [] as Option[],
        };

        // question text: 
        let i = 1;
        while (lines[i] != 'MC') {
          questionObj.questionText += lines[i++] + "\n";
        }

        // defaultMark
        while (lines[i] != 'Default mark :') {
          i++;
        } questionObj.defaultMark = lines[i + 1];

        // numberOfOptions
        while (lines[i] != 'Number of options?') {
          i++;
        } questionObj.numberOfOptions = parseInt(lines[i + 1], 10);

        while (lines[i] != 'Grade') {
          i++;
        }

        // options
        i += 2;
        for (let j = 0; j < questionObj.numberOfOptions; j++) {
          const optionText = lines[i + j * 3];
          const optionMark = lines[i + j * 3 + 1];
          if (optionText == '000' || optionText == '001') {
            break;
          }
          questionObj.options.push({
            optionText: optionText,
            optionMark: optionMark
          });
        }
        quizData.push(questionObj);

      });
      console.log(JSON.stringify(quizData, null, 2));
      // console.log(JSON.stringify(text))
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };


  const handleClick = async () => {
    const dateTime = `${quizDate}T${quizStartTime}:00`;
    const quizdate = new Date(quizDate);
    const stime = new Date(dateTime);
    const quiztime = `${quizDate}T${quizEndTime}:00`;
    const etime = new Date(quiztime);
    //@ts-ignore
    const teacher: Teacher['initial'] = session.data?.user?.initial;
    const result = await createQuiz({
      title: quizName,
      date: quizdate,
      startTime: stime,
      endTime: etime,
      totalQuestions: 10,
      teacher: teacher,
      course: courseId,
      branch: branch
    })

    if (result && result.message) {
      toast({
        title: result.message,
      })
    } else if (result.error) {
      toast({
        title: result.error,
        variant: "destructive",
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
        <div className="relative">
          <Label htmlFor="upload-file" className="w-full">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {fileName ? fileName : "Upload Quiz Word File"}
            </Button>
          </Label>
          <Input
            id="upload-file"
            name="quizFile"
            type="file"
            accept=".doc,.docx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <Button className="w-full" onClick={handleClick}>
        Create Quiz
      </Button>
    </form >
  )
}
