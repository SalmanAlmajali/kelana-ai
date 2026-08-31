import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthService } from "@/services/authService";
import NewTripDashboardClient from "./NewTripDashboardClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    const userRes = await AuthService.getMe(token);
    user = userRes.data;
  } catch (err) {
    console.error(err);
    redirect("/login");
  }

  return <NewTripDashboardClient user={user} />;
}
