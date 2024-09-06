import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function AddStudentsDialog() {
    return <>
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex justify-center items-center">
                    <div><Button size={"sm"} variant="default">new</Button></div>
                    <div className="ml-3"><Button size={"sm"} variant="default">update</Button></div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add branch</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a new branch here. Click submit when done.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    </>
}