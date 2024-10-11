"use server"
import { revalidatePath } from "next/cache"
import db from "@/db"
import { Question } from "@prisma/client"

export default async function({quizId}:{quizId:number}){
try{
    const res = await db.quiz.findUnique({
        where:{
            id:quizId
        },
        select:{
            questions:{
                select:{
                    id:true,
                    questionText:true,
                    defaultMark:true,
                    numberOfOptions:true,
                    options:{
                        select:{
                            id:true,
                            optionMark:true,
                            optionText:true
                        }
                    }
                }
            }
        }
    })
    if(res&&res.questions){
        console.log(typeof(res));
        return res?.questions||[]
    }
}catch(e){
    console.log(e);
}
} 