"use client"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { deleteQuiz } from "@/actions/teacher/deleteQuiz"
import { Button } from "../ui/button"
import { Edit } from "lucide-react"
import { Trash } from "lucide-react"

export function DeleteButton({id,initial,courseId,branch}:{id:number,initial:string,courseId:string,branch:string}){
const {toast}=useToast();
const handleDelete=async()=>{
const res=await deleteQuiz({id,initial,courseID:courseId,branch})
if(res&&res.message){
    toast({
        title:res.message
    })
}else if(res.error){
    toast({
        title:res.error,
        variant:"destructive"
    })
}
}
return ( 
    <div>
        <Button variant="outline" size="sm" onClick={()=>handleDelete()}>
        <Trash className="mr-2 h-4 w-4" />
        Delete 
        </Button>
    </div>
)
}