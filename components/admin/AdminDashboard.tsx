import AllBranches from "./AllBranches";
import { AdminAppbar } from "./AdminAppbar";
import db from "../../db/index"

export async function fetchAllBranches() {
    try{
        const branches = await db.branch.findMany();
        return branches;
    } catch(e) {
        console.log(e);
    }
}

export default async function AdminDashboard ({ name, email }: {
    name: string;
    email: string;
}) {
    const branches = await fetchAllBranches();
    
    return <div> 
        <AdminAppbar/>
        hi { name }
        <AllBranches branches={branches}/>
    </div>
}