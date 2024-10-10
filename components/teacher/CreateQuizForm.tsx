"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload } from "lucide-react"
import { createQuiz } from "@/actions/teacher/createQuiz"
import { useToast } from "@/hooks/use-toast"
import { Teacher } from "@prisma/client"
import mammoth from "mammoth";

interface Props {
  courseId: string,
  branch: string
}

interface Option {
  optionText: string,
  optionMark: string,
}

interface QuizData {
  questionText: string,
  defaultMark: string
  numberOfOptions: number,
  options: Option[]
}

export function CreateQuizForm({ courseId, branch }: Props): JSX.Element {
  const session = useSession();
  const datetime = new Date();
  const { toast } = useToast();
  const [quizName, setQuizName] = useState("")
  const [quizDate, setQuizDate] = useState("")
  const [quizStartTime, setQuizSTime] = useState("")
  const [quizEndTime, setQuizETime] = useState("")
  const [quizDuration, setQuizDuration] = useState<string>("")
  const [customDuration, setCustomDuration] = useState<string>("")
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false);

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
    setFileUploaded(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      const questions = text.split(/Question \d+/).slice(1); // Split and skip the first element
      const quizData: QuizData[] = [];

      questions.forEach((question) => {
        const lines = question.trim().split('\n').filter(line => line.trim() !== '');

        const questionObj = {
          questionText: '',
          defaultMark: '',
          numberOfOptions: 0,
          options: [] as Option[],
        };

        // Extract question text
        let i = 1;
        while (lines[i] !== 'MC' && i < lines.length) {
          questionObj.questionText += lines[i++] + "\n";
        }

        // Extract default mark
        while (lines[i] !== 'Default mark :') {
          i++;
        }
        questionObj.defaultMark = lines[i + 1];

        // Extract number of options
        while (lines[i] !== 'Number of options?') {
          i++;
        }
        questionObj.numberOfOptions = parseInt(lines[i + 1], 10);

        while (lines[i] !== 'Grade') {
          i++;
        }

        // Extract options
        i += 2;
        for (let j = 0; j < questionObj.numberOfOptions; j++) {
          const optionText = lines[i + j * 3];
          const optionMark = lines[i + j * 3 + 1];
          if (optionText === '000' || optionText === '001') {
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
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }

  const handleDurationChange = (value: string) => {
    setQuizDuration(value);
    if (value !== 'custom') {
      setCustomDuration("");
    }
  }

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDuration(value);
    setQuizDuration('custom');
  }

  const handleClick = async () => {
    if (fileUploaded == false) {
      toast({
        title: "Please select or upload a word file with quiz questions",
        variant: "destructive",
      });
      return;
    }

    const dateTime = `${quizDate}T${quizStartTime}:00`;
    const quizdate = new Date(quizDate);
    const stime = new Date(dateTime);
    const quiztime = `${quizDate}T${quizEndTime}:00`;
    const etime = new Date(quiztime);
    //@ts-ignore
    const teacher: Teacher['initial'] = session.data?.user?.initial;

    const finalDuration = quizDuration === 'custom' ? parseInt(customDuration) : parseInt(quizDuration);

    if (isNaN(finalDuration)) {
      toast({
        title: "Please select or enter a valid quiz duration",
        variant: "destructive",
      });
      return;
    }

    const result = await createQuiz({
      title: quizName,
      date: quizdate,
      startTime: stime,
      endTime: etime,
      duration: finalDuration,
      totalQuestions: 10,
      teacher: teacher,
      course: courseId,
      branch: branch
    });

    if (result && result.message) {
      toast({
        title: result.message,
      });
    } else if (result.error) {
      toast({
        title: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <form className="space-y-4">
      <div>
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
        <Label htmlFor="quizStartTime">Quiz Start Time</Label>
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
          id="quizEndTime"
          name="quizEndTime"
          type="time"
          value={quizEndTime}
          onChange={(e) => setQuizETime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="quizDuration">Quiz Duration (minutes)</Label>
        <Select value={quizDuration} onValueChange={handleDurationChange} required>
          <SelectTrigger id="quizDuration">
            <SelectValue placeholder="Select quiz duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1 hour 30 minutes</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
            <SelectItem value="custom">Custom duration</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {quizDuration === 'custom' && (
        <div>
          <Label htmlFor="customDuration">Custom Duration (minutes)</Label>
          <Input
            id="customDuration"
            name="customDuration"
            type="number"
            value={customDuration}
            onChange={handleCustomDurationChange}
            placeholder="Enter custom duration in minutes"
            min="1"
            required
          />
        </div>
      )}
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
    </form>
  )
}
