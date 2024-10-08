"use server";

import { revalidatePath } from "next/cache";
import db from "../../db";
import { Teacher } from "@prisma/client";

export async function createQuiz({title,date,startTime,totalQuestions,teacher}:{
    title:string,
    date:Date,
    startTime:Date ,
    totalQuestions:number,
    teacher:Teacher
}){

try{
    await db.quiz.create({
        data:{
            title:title,
            date:date,
            startTime:startTime,
            totalQuestions:totalQuestions,
            teacher:{
                connect:{initial:teacher.initial}
            }
        }
    })
    revalidatePath("/");

    return {
        message: ' Quiz created successfully'
    }
}catch(e){
    console.log(e);
    return{
        error: "Error occured during quiz creation"
    }
}

}