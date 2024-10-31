'use server'

import { parse } from "path"
import db from "../db"
import { Attempt,Response,QuestionResponse,Question } from "@prisma/client"


export async function saveQuiz({quizID,usn,selectedOptions}:{quizID:number,usn:string,selectedOptions:{[key:number]:number}}){
try{
    const quiz= await db.quiz.findUnique({
        where:{
            id:quizID
        },
        include:{
            questions:{
                include:{
                    options:true
                }
            }
        }
    })
    if(!quiz){
        throw new Error('Quiz not found ')
    }
    let marksObtained=0;
    let totalMarks=0;
    quiz.questions.forEach(question=>{
        totalMarks+=parseInt(question.defaultMark)
        if(selectedOptions[question.id]===question.correctOptionID){
            marksObtained+=parseInt(question.defaultMark);
        }
    })
    const attempt= await db.attempt.create({
        data:{
            usn:usn,
            quizId:quizID,
            marksObtained:marksObtained,
            totalMarks:totalMarks
        }
    })

    const response= await db.response.create({
        data:{
            attemptId:attempt.id
        }
    })

    const questionResponses=await Promise.all(
        Object.entries(selectedOptions).map(async([questionID,selectedOptionID])=>{
            const question= quiz.questions.find(q=>q.id===parseInt(questionID))
            if(!question){
                throw new Error(`Question with id ${questionID} not found `)
            }
            const marksAwarded= selectedOptionID===question.correctOptionID?parseInt(question.defaultMark):0;
            return db.questionResponse.create({
                data:{
                    responseId:response.id,
                    questionId:parseInt(questionID),
                    selectedOptionId:selectedOptionID,
                    marksAwarded:marksAwarded
                }
            })
        })
    )
    return {
        success:true,
        attemptId:attempt.id,
        marksObtained,
        totalMarks
    }
}catch(error){
    console.error("Error saving attempt ",error)
    return{
        success:false,
        error:'Failed to save quiz submission'
    }
}



}

export async function getAttemptDetails({usn}:{usn:string}){
try{
    const quizzes= await db.attempt.findMany({
        where:{
            usn:usn
        },select:{
            quizId:true
        }
    })
    return quizzes;
}catch(error){

    return {}
}
}