"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload } from "lucide-react"
// import { createQuiz } from "./actions"

export function CreateQuizForm() {
  const [quizName, setQuizName] = useState("")
  const [quizDate, setQuizDate] = useState("")
  const [quizTime, setQuizTime] = useState("")
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

  return (
    <form action={() => alert("hi")} className="space-y-4">
      <div>
        <Label htmlFor="quizName">Quiz Name</Label>
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
          onChange={(e) => setQuizDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="quizTime">Quiz Time</Label>
        <Input
          id="quizTime"
          name="quizTime"
          type="time"
          value={quizTime}
          onChange={(e) => setQuizTime(e.target.value)}
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
      <Button type="submit" className="w-full">
        Create Quiz
      </Button>
    </form>
  )
}
