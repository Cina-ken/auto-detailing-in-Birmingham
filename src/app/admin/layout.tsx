import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }
  if (session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/"); // Redirect non-admins to home
  }
  return <>{children}</>;
}
