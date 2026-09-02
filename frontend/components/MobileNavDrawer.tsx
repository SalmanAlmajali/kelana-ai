"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Button, useOverlayState, Spinner, Dropdown, Modal, Input, TextField, Label } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CompassIcon, MapIcon, UserIcon, MessageSquareIcon, PlusIcon, MoreVerticalIcon, PencilIcon, TrashIcon, LogOutIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { ChatService, Conversation } from "@/services/chatService";

export default function MobileNavDrawer({ user }: { user?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConversationId = searchParams?.get('id');

  const state = useOverlayState();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    state.setOpen(false);
  }, [pathname, searchParams]); // Close drawer on route change

  useEffect(() => {
    loadConversations();

    const handleChatCreated = () => {
      loadConversations();
    };

    window.addEventListener('chat-created', handleChatCreated);
    return () => window.removeEventListener('chat-created', handleChatCreated);
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingChats(true);
      const data = await ChatService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const renameModalState = useOverlayState();
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const openRenameModal = (id: number, currentTitle: string) => {
    setRenameId(id);
    setRenameTitle(currentTitle);
    renameModalState.open();
  };

  const handleRenameSubmit = async () => {
    if (!renameId || !renameTitle.trim()) return;

    try {
      setIsRenaming(true);
      await ChatService.updateConversation(renameId, renameTitle);
      loadConversations();
      renameModalState.close();
    } catch (err) {
      console.error("Failed to rename conversation:", err);
      alert("Failed to rename conversation.");
    } finally {
      setIsRenaming(false);
    }
  };

  const deleteModalState = useOverlayState();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    deleteModalState.open();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await ChatService.deleteConversation(deleteId);

      // If we deleted the currently active chat, reset the view
      if (activeConversationId === String(deleteId)) {
        router.push("/chat");
      }

      loadConversations();
      deleteModalState.close();
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      alert("Failed to delete conversation.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/login";
  };

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
          <Drawer.Dialog className="bg-zinc-950/95 border-l border-white/10 text-white min-w-70 w-3/4 max-w-sm">
            <Drawer.CloseTrigger className="mt-2 text-white hover:text-white" />
            <Drawer.Header className="border-b border-white/10 pb-5 shrink-0">
              <Drawer.Heading className="flex items-center gap-2 font-bold text-xl">
                <CompassIcon className="h-6 w-6 text-primary" />
                KelanaAI
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="p-0 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col gap-1">
                  <Link href="/profile">
                    <div className={`flex items-center gap-3 py-3 rounded-xl transition-colors ${pathname === '/profile' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium text-base">New Trip</span>
                    </div>
                  </Link>
                  <Link href="/trips">
                    <div className={`flex items-center gap-3 py-3 rounded-xl transition-colors ${pathname === '/trips' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                      <MapIcon className="h-5 w-5" />
                      <span className="font-medium text-base">My Trips</span>
                    </div>
                  </Link>
                  <Link href="/assistant">
                    <div className={`flex items-center gap-3 py-3 rounded-xl transition-colors ${pathname === '/assistant' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                      <MessageSquareIcon className="h-5 w-5" />
                      <span className="font-medium text-base">Assistant</span>
                    </div>
                  </Link>
                </nav>

                {/* Conversations History */}
                <div className="space-y-1 mt-2">
                  <div className="flex items-center justify-between py-1 mb-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Chats
                    </p>
                    <Link href="/chat" onClick={() => state.setOpen(false)}>
                      <Button size="sm" isIconOnly variant="primary" className="text-white hover:text-white">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-0.5 pb-6">
                    {loadingChats ? (
                      <div className="flex justify-center p-2"><Spinner size="sm" /></div>
                    ) : conversations.length === 0 ? (
                      <p className="px-2 py-1 text-xs text-zinc-600 italic">No history</p>
                    ) : (
                      conversations.map(conv => {
                        const isActive = pathname === '/chat' && activeConversationId === String(conv.id);
                        return (
                          <div
                            key={conv.id}
                            className={`group flex items-center justify-between rounded-lg transition-colors ${isActive ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
                              }`}
                          >
                            <Link href={`/chat?id=${conv.id}`} className="flex-1 min-w-0" onClick={() => state.setOpen(false)}>
                              <div className={`flex items-center gap-2 py-2 text-sm ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                                }`}>
                                <MessageSquareIcon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{conv.title || "Untitled Chat"}</span>
                              </div>
                            </Link>

                            <Dropdown className="bg-zinc-900 border border-white/10">
                              <Dropdown.Trigger>
                                <div className="rounded-md cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-1">
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </div>
                              </Dropdown.Trigger>
                              <Dropdown.Popover>
                                <Dropdown.Menu aria-label="Conversation Actions">
                                  <Dropdown.Item
                                    key="rename"
                                    onPress={() => openRenameModal(conv.id, conv.title)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <PencilIcon className="w-4 h-4" />
                                      Rename
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    key="delete"
                                    className="text-danger"
                                    onPress={() => openDeleteModal(conv.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <TrashIcon className="w-4 h-4" />
                                      Delete
                                    </div>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown.Popover>
                            </Dropdown>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 shrink-0">
                {user && (
                  <Dropdown className="bg-zinc-900 border border-white/10">
                    <Dropdown.Trigger className={'w-full'}>
                      <div className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors rounded-xl border border-white/5 cursor-pointer">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </Dropdown.Trigger>
                    <Dropdown.Popover placement="top">
                      <Dropdown.Menu aria-label="User Actions">
                        <Dropdown.Item key="logout" className="text-danger" onPress={handleLogout}>
                          <div className="flex items-center gap-2">
                            <LogOutIcon className="w-4 h-4" />
                            Logout
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                )}
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      <Modal.Backdrop isOpen={renameModalState.isOpen} onOpenChange={renameModalState.setOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-zinc-950 border border-white/10 text-white mx-4">
            <Modal.Header className="border-b border-white/10">
              <Modal.Heading>Rename Conversation</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-6">
              <TextField
                autoFocus
                value={renameTitle}
                onChange={setRenameTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSubmit();
                  }
                }}
                className="w-full"
              >
                <Label className="text-zinc-400 mb-1">Conversation Name</Label>
                <Input
                  placeholder="Enter new name"
                  className="w-full bg-zinc-900 border border-white/20 focus:border-primary text-white rounded-lg px-3 py-2 outline-none"
                />
              </TextField>
            </Modal.Body>
            <Modal.Footer className="border-t border-white/10">
              <Button variant="secondary" className="text-zinc-400 hover:text-white" onPress={renameModalState.close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleRenameSubmit} isPending={isRenaming}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <Modal.Backdrop isOpen={deleteModalState.isOpen} onOpenChange={deleteModalState.setOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-zinc-950 border border-white/10 text-white mx-4">
            <Modal.Header>
              <Modal.Heading>Delete Conversation</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-6">
              <p className="text-zinc-400 text-sm">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="text-zinc-400 hover:text-white" onPress={deleteModalState.close}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDeleteConfirm} isPending={isDeleting}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

    </div>
  );
}
