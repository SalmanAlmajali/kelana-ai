"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { CompassIcon, MapIcon, UserIcon, LogOutIcon, MessageSquareIcon } from "lucide-react";

export default function SidebarNav({ user }: { user?: any }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <CompassIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">KelanaAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <Link href="/profile">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-primary/20 text-primary' : 'text-default-500 hover:bg-default-100/10 hover:text-foreground'}`}>
            <UserIcon className="h-5 w-5" />
            <span className="font-medium">New Trip</span>
          </div>
        </Link>
        <Link href="/trips">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/trips' ? 'bg-primary/20 text-primary' : 'text-default-500 hover:bg-default-100/10 hover:text-foreground'}`}>
            <MapIcon className="h-5 w-5" />
            <span className="font-medium">My Trips</span>
          </div>
        </Link>
        <Link href="/assistant">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/assistant' ? 'bg-primary/20 text-primary' : 'text-default-500 hover:bg-default-100/10 hover:text-foreground'}`}>
            <MessageSquareIcon className="h-5 w-5" />
            <span className="font-medium">Assistant</span>
          </div>
        </Link>
      </nav>

      {/* Bottom Actions & User Profile */}
      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="bg-default-50/5 rounded-xl p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-1">Upgrade to Premium</h4>
          <p className="text-xs text-default-400 mb-3">Boost productivity with seamless automation and responsive AI.</p>
          <button className="w-full font-medium text-sm py-2 rounded-lg bg-white text-black hover:bg-primary/90 transition-colors">
            Upgrade
          </button>
        </div>

        {/* User Identity */}
        {user && (
          <Dropdown placement="top" className="bg-zinc-900 border border-white/10" type="menu">
            <DropdownTrigger>
              <div className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors rounded-xl border border-white/5 cursor-pointer">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="logout" className="text-danger" color="danger" onPress={handleLogout}>
                <div className="flex items-center gap-2">
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </aside>
  );
}
