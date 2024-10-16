
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideLoader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getQuestions, update } from "@/actions/teacher/fetchQuestions"
import { useSearchParams, useRouter } from "next/navigation"

interface Option {
  id: number
  optionText: string
}

interface Question {
  id: number
  questionText: string
  options: Option[]
}

interface QuizData {
  duration: number
  questions: Question[]
  attempted: boolean
}

export default function StudentQuiz() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const questionsPerPage = 5

  useEffect(() => {
    const loadQuestions = async () => {
      if (quizId === null) {
        router.back()
        return
      }

      setIsLoading(true)
      try {
        const response = await getQuestions({ quizId: parseInt(quizId) })
        if (response && 'questions' in response && 'duration' in response && 'attempted' in response) {
          setQuizData(response as QuizData)
          if (!response.attempted) {
            await update({ quizId: parseInt(quizId) })
            setRemainingTime(response.duration * 60)
          }
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [quizId, toast, router])

  useEffect(() => {
    if (remainingTime > 0 && quizData && !quizData.attempted) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [remainingTime, quizData])

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Actual submission logic would go here
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LucideLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">No quiz data available</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  if (quizData.attempted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">You have already attempted this quiz</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Quiz Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Your quiz has been submitted successfully.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.replace('/')}>Go to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const totalPages = Math.ceil(quizData.questions.length / questionsPerPage)
  const startIndex = (currentPage - 1) * questionsPerPage
  const endIndex = startIndex + questionsPerPage
  const currentQuestions = quizData.questions.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Page {currentPage} of {totalPages}</span>
            <span className="text-lg font-bold">Time Left: {formatTime(remainingTime)}</span>
          </CardTitle>
        </CardHeader>
      </Card>
      {currentQuestions.map((question, index) => (
        <Card key={question.id} className="w-full max-w-2xl mx-auto mb-4">
          <CardHeader>
            <CardTitle>Question {startIndex + index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
            <RadioGroup
              value={selectedOptions[question.id]?.toString()}
              onValueChange={(value: any) => handleOptionSelect(question.id, parseInt(value))}
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option.id.toString()} id={`option-${question.id}-${option.id}`} />
                  <Label htmlFor={`option-${question.id}-${option.id}`}>{option.optionText}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between mt-4">
        <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
        </Button>
        {currentPage === totalPages ? (
          <Button onClick={handleSubmit} disabled={isSubmitted}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
            Next Page <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
