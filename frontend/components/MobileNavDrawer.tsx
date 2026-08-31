"use client";

import React, { useEffect } from "react";
import { Drawer, Button, useOverlayState } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompassIcon, MapIcon, UserIcon, MessageSquareIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function MobileNavDrawer({ user }: { user?: any }) {
  const pathname = usePathname();
  const state = useOverlayState();

  useEffect(() => {
    state.setOpen(false);
  }, [pathname, state]);

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-black">
          <CompassIcon className="size-5 text-white" />
        </div>
        <span className="font-bold text-lg">KelanaAI</span>
      </div>

      <Button variant="tertiary" isIconOnly className="text-white min-w-10" onPress={state.open}>
        <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
      <Drawer.Backdrop variant="blur" isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="bg-zinc-950/95 border-l border-white/10 text-white min-w-70">
            <Drawer.CloseTrigger className="mt-2 text-zinc-400 hover:text-white" />
            <Drawer.Header className="border-b border-white/10 p-5">
              <Drawer.Heading className="flex items-center gap-2 font-bold text-xl">
                <CompassIcon className="h-6 w-6 text-primary" />
                KelanaAI
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="p-4 flex flex-col h-full">
              <nav className="flex flex-col gap-2 mt-4">
                <Link href="/profile">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/profile' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <UserIcon className="h-5 w-5" />
                    <span className="font-medium text-base">New Trip</span>
                  </div>
                </Link>
                <Link href="/trips">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/trips' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <MapIcon className="h-5 w-5" />
                    <span className="font-medium text-base">My Trips</span>
                  </div>
                </Link>
                <Link href="/assistant">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/assistant' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <MessageSquareIcon className="h-5 w-5" />
                    <span className="font-medium text-base">Assistant</span>
                  </div>
                </Link>
              </nav>

              <div className="pt-6 border-t border-white/10 space-y-4 mt-auto mb-4">
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-end pr-2">
                  <LogoutButton />
                </div>
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </div>
  );
}
