// 'use client'

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { LucideLoader2, ChevronLeft, ChevronRight } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { getQuestions } from "@/actions/teacher/fetchQuestions"
// import { useSearchParams, useRouter } from "next/navigation"

// interface Option {
//   id: number
//   optionText: string
// }

// interface Question {
//   id: number
//   questionText: string
//   options: Option[]
// }

// interface Quiz {
//   duration: number
//   questions: Question[]
// }

// export default function StudentQuiz() {
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [remainingTime, setRemainingTime] = useState(0) 
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const quizId = searchParams.get('quizId')

//   useEffect(() => {
//     const loadQuestions = async () => {
//       if (quizId === null) {
//         router.back()
//         return
//       }
    
//       setIsLoading(true)
//       try {
//         const response = await getQuestions({ quizId: parseInt(quizId) })
//         if (response && 'questions' in response && 'duration' in response) {
//           setQuestions(response.questions)
//           setRemainingTime(response.duration * 60)
//         } else {
//           throw new Error("Invalid response format")
//         }
//       } catch (error) {
//         console.error("Error fetching questions:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load questions. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadQuestions()
//   }, [quizId, toast, router])

//   useEffect(() => {
//     if (remainingTime > 0) {
//       const timer = setInterval(() => {
//         setRemainingTime((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(timer)
//             handleSubmit()
//             return 0
//           }
//           return prevTime - 1
//         })
//       }, 1000)

//       return () => clearInterval(timer)
//     }
//   }, [remainingTime])

//   const handleOptionSelect = (questionId: number, optionId: number) => {
//     setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }))
//   }

//   const handlePrevQuestion = () => {
//     setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
//   }

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
//   }

//   const handleSubmit = async () => {
//     setIsLoading(true)
//     try {
//       await fetch(`/api/quiz/${quizId}/submit`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ answers: selectedOptions }),
//       })
//       setIsSubmitted(true)
//     } catch (error) {
//       console.error("Error submitting quiz:", error)
//       toast({
//         title: "Error",
//         description: "Failed to submit quiz. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <LucideLoader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h2 className="text-2xl font-bold mb-4">No questions available</h2>
//         <Button onClick={() => router.back()}>Go Back</Button>
//       </div>
//     )
//   }

//   if (isSubmitted) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-center">Quiz Submitted</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-center mb-4">Your quiz has been submitted successfully.</p>
//           </CardContent>
//           <CardFooter className="flex justify-center">
//             <Button onClick={() => router.replace('/')}>Go to Home Page</Button>
//           </CardFooter>
//         </Card>
//       </div>
//     )
//   }

//   const currentQuestion = questions[currentQuestionIndex]

//   return (
//     <div className="container mx-auto p-4">
//       <Card className="w-full max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
//             <span className="text-lg font-bold">Time Left: {formatTime(remainingTime)}</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <h2 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h2>
//           <RadioGroup
//             value={selectedOptions[currentQuestion.id]?.toString()}
//             onValueChange={(value) => handleOptionSelect(currentQuestion.id, parseInt(value))}
//           >
//             {currentQuestion.options.map((option) => (
//               <div key={option.id} className="flex items-center space-x-2 mb-2">
//                 <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
//                 <Label htmlFor={`option-${option.id}`}>{option.optionText}</Label>
//               </div>
//             ))}
//           </RadioGroup>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
//             <ChevronLeft className="mr-2 h-4 w-4" /> Previous
//           </Button>
//           {currentQuestionIndex === questions.length - 1 ? (
//             <Button onClick={handleSubmit} disabled={isLoading}>
//               Submit Quiz
//             </Button>
//           ) : (
//             <Button onClick={handleNextQuestion}>
//               Next <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }






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
}

export default function StudentQuiz() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const attempted=true;
  useEffect(() => {
    const loadQuestions = async () => {
      if (quizId === null) {
        router.back()
        return
      }
    
      setIsLoading(true)
      try {
        const response = await getQuestions({ quizId: parseInt(quizId) })
        if (response && 'questions' in response && 'duration' in response ) {
          setQuizData(response as QuizData)
          if (!attempted) {
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
    if (remainingTime > 0 && quizData && !attempted) {
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

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min((quizData?.questions.length || 1) - 1, prev + 1))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Actual submission logic is commented out as requested
    // try {
    //   await fetch(`/api/quiz/${quizId}/submit`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ answers: selectedOptions }),
    //   })
    // } catch (error) {
    //   console.error("Error submitting quiz:", error)
    // }
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

  if (attempted) {
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

  const currentQuestion = quizData.questions[currentQuestionIndex]

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
            <span className="text-lg font-bold">Time Left: {formatTime(remainingTime)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h2>
          <RadioGroup
            value={selectedOptions[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleOptionSelect(currentQuestion.id, parseInt(value))}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`}>{option.optionText}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitted}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}