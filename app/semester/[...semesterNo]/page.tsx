import AllBranches from "@/components/admin/AllBranches";
import db from "../../../db/index"

export async function fetchAllBranches({ semester }: {
  semester: number
}) {
  try {
    // console.log(semester)
    const branches = await db.branch.findMany({
      where: {
        semester
      }
    });
    return branches;
  } catch (e) {
    console.log(e);
  }
}

export default async function Semester({ params }: any) {
  const semester = params.semesterNo;
  const branches = await fetchAllBranches({ semester: parseInt(semester) });

  return (
    <>
      <AllBranches branches={branches} semester={parseInt(semester)} />
    </>
  )
}
