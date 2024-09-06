import { authOptions } from '@/app/authStore/auth';
import AllStudents from '@/components/admin/AllStudents';
import { StudentsTable } from '@/components/admin/StudentsTable';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation'

export default async function AdminPage({ params }: {
    params: any
}) {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect("/");
    }

    return <>
        <AllStudents code={params.branches[0]}/>
    </>
}