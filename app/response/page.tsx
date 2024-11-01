'use client'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import getResponseDetails from "@/actions/getReponseDetails"
import { useEffect,useState } from "react"
import { useSearchParams } from "next/navigation"
import { LucideLoader2 } from "lucide-react"

interface Option{
    id:number
    optionText:string
}

interface QuesResp{
    marksAwarded:number|null
    question:Question
    selectedOptionId:number|null
}

interface Question{
    questionText:string
    correctOptionID:number
    options:Option[]

}
interface props{
    marksObtained:number
    questions:QuesResp[]
    totalMarks:number
}



export default function QuizResults() {
  const [isloading,setLoading]=useState(false)
  const [totalMarks,setTotalMarks]=useState(0);
  const [marksScored,setMarksScored]=useState(0);
  const [questions,setQuestions]=useState<QuesResp[]>([]);
  const progressPercentage = (marksScored / totalMarks) * 100
  const searchParams=useSearchParams();
  const quizid=searchParams.get('testId')
  const usn=searchParams.get('usn')
    useEffect(()=>{
        setLoading(true)
        const res=async()=>{
            const result=await getResponseDetails({quizID:parseInt(quizid!),usn:usn!})
            if(result){
                setTotalMarks(result.totalMarks!);
                setMarksScored(result.marksObtained!);
                setQuestions(result.questions)
            }
            //console.log(result)
            setLoading(false)
        }
        res()
    },[quizid,usn])

    //console.log(questions)
if(isloading){
    return(
        <div className="flex justify-center items-center h-screen">
        <LucideLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
}
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <div className="mb-6">
        <p className="text-lg mb-2">
          Score: {marksScored} out of {totalMarks}
        </p>
        <Progress value={progressPercentage} className="w-full h-4" />
      </div>
      {questions.map((question, index) => (
        <Card  className="mb-6">
          <CardHeader>
            <CardTitle>Question {index + 1}: {question.question.questionText}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-2">Options:</p>
            <ul className="list-disc pl-6 mb-4">
              {question.question.options.map((option) => (
                <li
                  key={option.id}
                  className={`${
                    option.id === question.selectedOptionId
                      ? 'font-semibold'
                      : ''
                  } ${
                    option.id === question.question.correctOptionID
                      ? 'text-green-600'
                      : option.id === question.selectedOptionId && option.id !== question.question.correctOptionID
                      ? 'text-red-600'
                      : ''
                  }`}
                >
                  {option.optionText}
                  {option.id === question.selectedOptionId && ' (Selected)'}
                  {option.id === question.question.correctOptionID && ' (Correct)'}
                </li>
              ))}
            </ul>
            <p className="font-semibold">
              Marks Awarded: {question.marksAwarded}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}