import SidebarNav from "@/components/SidebarNav";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import { cookies } from "next/headers";
import { AuthService } from "@/services/authService";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user = null;
  if (token) {
    try {
      const userRes = await AuthService.getMe(token);
      user = userRes.data;
    } catch(err) {}
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      <SidebarNav user={user} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-zinc-900 to-zinc-950">
        
        {/* Mobile Header with HeroUI Drawer */}
        <MobileNavDrawer user={user} />

        {/* Content Padding */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
