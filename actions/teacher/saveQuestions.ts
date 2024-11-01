'use server'

import { revalidatePath } from 'next/cache'
import db from "@/db"

interface Option {
  id?: number
  optionText: string
  optionMark: string
}

interface Question {
  id?: number
  questionText: string
  defaultMark: string
  numberOfOptions: number
  options: Option[]
  correctOptionID: number
}

export async function saveQuestions(quizId: number, questions: Question[]) {
  const MAX_RETRIES = 3
  let retries = 0
  console.log(questions)
  while (retries < MAX_RETRIES) {
    try {
      let changesMade = false;

      await db.$transaction(async (tx) => {
        const existingQuestions = await tx.question.findMany({
          where: { quizId },
          include: { options: true },
        })

        for (const question of questions) {
          let updatedQuestion;
          const existingQuestion = question.id 
            ? existingQuestions.find(q => q.id === question.id)
            : null;

          if (existingQuestion) {
            if (
              existingQuestion.questionText !== question.questionText ||
              existingQuestion.defaultMark !== question.defaultMark ||
              existingQuestion.numberOfOptions !== question.numberOfOptions ||
              existingQuestion.correctOptionID !== question.correctOptionID
            ) {
              updatedQuestion = await tx.question.update({
                where: { id: question.id },
                data: {
                  questionText: question.questionText,
                  defaultMark: question.defaultMark,
                  numberOfOptions: question.numberOfOptions,
                  correctOptionID: question.correctOptionID
                },
              })
              changesMade = true;
            } else {
              updatedQuestion = existingQuestion;
            }
          } else {
            updatedQuestion = await tx.question.create({
              data: {
                quizId,
                questionText: question.questionText,
                defaultMark: question.defaultMark,
                numberOfOptions: question.numberOfOptions,
                correctOptionID: question.correctOptionID
              },
            })
            changesMade = true;
          }

          const questionId = updatedQuestion.id

          const existingOptions = existingQuestion ? existingQuestion.options : [];
          const optionsToDelete = existingOptions.filter(
            eo => !question.options.some(o => o.id === eo.id)
          );

          if (optionsToDelete.length > 0) {
            await tx.option.deleteMany({
              where: {
                id: { in: optionsToDelete.map(o => o.id) },
              },
            })
            changesMade = true;
          }

          const updatedOptions = [];

          for (const option of question.options) {
            let updatedOption;
            if (option.id) {
              const existingOption = existingOptions.find(eo => eo.id === option.id);

              if (existingOption) {
                if (
                  existingOption.optionText !== option.optionText ||
                  existingOption.optionMark !== option.optionMark
                ) {
                  updatedOption = await tx.option.update({
                    where: { id: option.id },
                    data: {
                      optionText: option.optionText,
                      optionMark: option.optionMark,
                    },
                  })
                  changesMade = true;
                } else {
                  updatedOption = existingOption;
                }
              } else {
                updatedOption = await tx.option.create({
                  data: {
                    questionId: questionId,
                    optionText: option.optionText,
                    optionMark: option.optionMark,
                  },
                })
                changesMade = true;
              }
            } else {
              updatedOption = await tx.option.create({
                data: {
                  questionId: questionId,
                  optionText: option.optionText,
                  optionMark: option.optionMark,
                },
              })
              changesMade = true;
            }
            updatedOptions.push(updatedOption);
          }

          // Update the correctOptionID if it's referring to a new option
          if (!existingQuestion || !question.id) {
            const correctOption = updatedOptions[question.correctOptionID - 1];
            if (correctOption && correctOption.id !== question.correctOptionID) {
              await tx.question.update({
                where: { id: questionId },
                data: { correctOptionID: correctOption.id },
              });
              changesMade = true;
            }
          }
        }

        const questionsToDelete = existingQuestions.filter(
          eq => !questions.some(q => q.id === eq.id)
        );

        if (questionsToDelete.length > 0) {
          await tx.question.deleteMany({
            where: {
              id: { in: questionsToDelete.map(q => q.id) },
            },
          })
          changesMade = true;
        }
      }, {
        timeout: 10000, 
        maxWait: 15000, 
      })

      if (changesMade) {
        revalidatePath(`/quizzes/${quizId}`)
        return { success: true, message: 'Quiz updated successfully' }
      } else {
        return { success: true, message: 'No changes were necessary' }
      }
    } catch (error) {
      retries++
      if (error.code === 'P2028' && retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
      } else {
        console.error('Error updating quiz:', error)
        return { success: false, message: 'Failed to update quiz' }
      }
    }
  }

  return { success: false, message: 'Failed to update quiz after multiple attempts' }
}