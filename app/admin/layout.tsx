import { checkAdminRole } from "@/lib/adminUtils";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await checkAdminRole();

  if (!isAdmin) {
    redirect("/login");
  }

  return <>{children}</>;
}
