import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function AddStudentsDialog() {
  return <>
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center">
          <div><Button size={"sm"} variant="default">new</Button></div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new students list afresh</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Button size={"sm"} variant={"default"}><a href="files/addnewstudents.xlsx" download={"newstudents.xlsx"}>Download excel-file</a></Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  </>
}

