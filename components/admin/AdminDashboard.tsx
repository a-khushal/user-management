import { AdminAppbar } from "./AdminAppbar";
import AllSemesters from "./AllSemesters";

export default async function AdminDashboard({ name, email }: {
  name: string;
  email: string;
}) {
  return <div>
    <AdminAppbar />
    hi {name}
    <AllSemesters />
  </div>
}
