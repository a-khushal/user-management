"use client"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { deleteQuiz } from "@/actions/teacher/deleteQuiz"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog"

export function DeleteButton({ id, initial, courseId, branch }: { id: number, initial: string, courseId: string, branch: string }) {
  const { toast } = useToast();
  const handleDelete = async () => {
    const res = await deleteQuiz({ id, initial, courseID: courseId, branch })
    if (res && res.message) {
      toast({
        title: res.message
      })
    } else if (res.error) {
      toast({
        title: res.error,
        variant: "destructive"
      })
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline"><Trash className="h-4" /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete?</DialogTitle>
            <DialogDescription>
              Do you want to permanently delete this quiz
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button type="submit" variant={"secondary"} className="mr-20" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog >
    </>
  )
}
