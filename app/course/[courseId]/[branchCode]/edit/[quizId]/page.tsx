'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, LucideLoader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import fetchQuestions from "@/actions/teacher/fetchQuestions"
import { saveQuestions } from "@/actions/teacher/saveQuestions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Option {
  id: number
  optionText: string
  optionMark: string
}

interface Question {
  id: number
  questionText: string
  defaultMark: string
  numberOfOptions: number
  correctOptionID: number
  options: Option[]
}

export default function EditQuiz() {
  const { quizId } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true)
      try {
        const fetchedQuestions = await fetchQuestions({ quizId: parseInt(quizId as string) })
        if (!fetchedQuestions) {
          setQuestions([])
        } else {
          setQuestions(fetchedQuestions)
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
  }, [quizId, toast])

  const handleQuestionChange = (questionId: number, field: keyof Question, value: string | number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const handleOptionChange = (questionId: number, optionId: number, field: keyof Option, value: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options.map(o =>
          o.id === optionId ? { ...o, [field]: value } : o
        )
      } : q
    ))
  }

  const addQuestion = () => {
    const maxId = Math.max(0, ...questions.map(q => q.id))
    const newQuestion: Question = {
      id: maxId + 1,
      questionText: '',
      defaultMark: '1',
      numberOfOptions: 0,
      correctOptionID: 0,
      options: []
    }
    setQuestions([...questions, newQuestion])
  }

  const addOption = (questionId: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: [
          ...q.options,
          {
            id: Math.max(0, ...q.options.map(o => o.id)) + 1,
            optionText: '',
            optionMark: '0'
          }
        ],
        numberOfOptions: q.numberOfOptions + 1
      } : q
    ))
  }

  const removeQuestion = (questionId: number) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const removeOption = (questionId: number, optionId: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options.filter(o => o.id !== optionId),
        numberOfOptions: q.numberOfOptions - 1,
        correctOptionID: q.correctOptionID === optionId ? 0 : q.correctOptionID
      } : q
    ))
  }

  const validateQuestions = (): string | null => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionNumber = i + 1;

      if (!question.questionText.trim()) {
        return `Question ${questionNumber} is missing text.`;
      }
      if (isNaN(parseFloat(question.defaultMark)) || parseFloat(question.defaultMark) < 0) {
        return `Question ${questionNumber} has an invalid default mark.`;
      }
      if (question.options.length < 2) {
        return `Question ${questionNumber} must have at least 2 options.`;
      }
      if (question.correctOptionID === 0) {
        return `Question ${questionNumber} must have a correct option selected.`;
      }
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j];
        const optionNumber = j + 1;

        if (!option.optionText.trim()) {
          return `Option ${optionNumber} in question ${questionNumber} is missing text.`;
        }
        if (isNaN(parseFloat(option.optionMark)) || parseFloat(option.optionMark) < 0) {
          return `Option ${optionNumber} in question ${questionNumber} has an invalid mark.`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateQuestions()
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      })
      return;
    }

    setIsLoading(true)
    try {
      await saveQuestions(parseInt(quizId as string), questions)
      toast({
        title: "Success",
        description: "Quiz questions have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving questions:", error)
      toast({
        title: "Error",
        description: "Failed to save questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LucideLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10 flex justify-center w-full mt-4">Edit Quiz</h1>
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((question, index) => (
          <div key={question.id} className="mb-8 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Question {index + 1}</h2>
              <Button variant="destructive" size="icon" onClick={() => removeQuestion(question.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={question.questionText}
              onChange={(e) => handleQuestionChange(question.id, 'questionText', e.target.value)}
              placeholder="Enter question text"
              className="mb-2"
            />
            <div className="space-y-2 mt-4">
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Label className="w-8">{`op ${optionIndex + 1}`}</Label>
                  <Input
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(question.id, option.id, 'optionText', e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    value={option.optionMark}
                    onChange={(e) => handleOptionChange(question.id, option.id, 'optionMark', e.target.value)}
                    placeholder="Mark"
                    className="w-20"
                  />
                  <Button variant="destructive" size="icon" onClick={() => removeOption(question.id, option.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Label>correct op</Label>
              <Select
                value={question.correctOptionID.toString()}
                onValueChange={(value) => handleQuestionChange(question.id, 'correctOptionID', parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option, optionIndex) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      Option {optionIndex + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Button onClick={() => addOption(question.id)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Option
              </Button>
              <Input
                type="number"
                value={question.defaultMark}
                onChange={(e) => handleQuestionChange(question.id, 'defaultMark', e.target.value)}
                placeholder="Default mark"
                className="w-32"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-64">No Quiz Questions found. Try creating a new quiz</div>
      )}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={addQuestion}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Question
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Submit Changes'}
        </Button>
      </div>
    </div>
  )
}