
import { getServerSession } from "next-auth";
import { authOptions } from "./authStore/auth";
import StudentDashboard from "@/components/student/StudentDashboard";
import { Appbar } from "@/components/Appbar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user && (session?.user?.role == 'STUDENT' || session?.user?.role == 'student')) {
    return <>
      <StudentDashboard />
    </>
  } else if (session?.user && (session?.user?.role == 'ADMIN' || session?.user?.role == 'admin')) {
    return <>
      <AdminDashboard name={session?.user?.name} email={session?.user?.email} />
    </>
  } else if (session?.user && (session?.user?.role == 'TEACHER' || session?.user?.role == 'teacher')) {
    return <>
      <TeacherDashboard />
    </>
  }

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-16">
        <Appbar />
      </div>
      <br />
      {JSON.stringify(session)}
    </div>
  );
}
