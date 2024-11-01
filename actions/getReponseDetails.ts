'use server'
import db from "../db"

export default async function getResponseDetails({quizID,usn}:{quizID:number,usn:string}){
try{
    const attempt=await db.attempt.findFirst({
        where:{
            quizId:quizID,
            usn:usn
        },include:{
                response:{
                    include:{
                        questionResponses:true
                    }
                }
        }
    })  
        const questionResponses= await db.questionResponse.findMany({
            where:{
                responseId:attempt?.response?.id
            },select:{
                question:{
                    select:{
                        questionText:true,
                        correctOptionID:true,
                        options:{
                            select:{
                                id:true,
                                optionText:true
                            }
                        }
                    }
                },
                marksAwarded:true,
                selectedOptionId:true,
            }
        })
        //console.log(questionResponses)
    
    return {
        marksObtained:attempt?.marksObtained,
        totalMarks:attempt?.totalMarks,
        questions:questionResponses
    }
}catch(error){
    console.error("Error fetching ",error)
}
}