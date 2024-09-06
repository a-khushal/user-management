import { allStudents } from "@/actions/allStudents";
import { StudentsTable } from "./StudentsTable";
import AddStudentsDialog from "./AddStudentsDialog";

export default async function AllStudents({ code }: {
    code: string
}) {
    const students = await allStudents({ code });
    return (
        <>  
            <div className="m-5">
                <div className="text-xl font-semibold flex items-center">
                    All Students of {code}
                    <div className="ml-5">
                        <AddStudentsDialog/>
                    </div>
                </div>
                <div className="mt-5 w-1/2">
                    <StudentsTable students={students}/>
                </div>
            </div>
        </>
    )
}