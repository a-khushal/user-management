
import AddBranchDialog from "./AddBranchDialog";
import { BranchCard } from "./BranchCard";

export default async function AllBranches({ branches }: { 
    branches: { 
        id: number,
        code: string,
        name: string,
    }[] | undefined
}) {
    return (
        <div className="ml-5">
            <div className="mt-5 text-3xl font-semibold">
                All Branches
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 w-3/5 gap-5" suppressHydrationWarning>
                { 
                    branches?.map((branch) => (
                        <BranchCard key={branch.id.toString()} name={branch.name} code={branch.code} />
                    ))
                }
            </div>
            <div>
                <AddBranchDialog/>
            </div>
        </div>
    );
}