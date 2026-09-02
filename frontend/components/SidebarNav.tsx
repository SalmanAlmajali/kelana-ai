"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dropdown, Button, Spinner, Modal, Input, TextField, Label, useOverlayState, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { CompassIcon, MapIcon, UserIcon, LogOutIcon, MessageSquareIcon, PlusIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatService, Conversation } from "@/services/chatService";

export default function SidebarNav({ user }: { user?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConversationId = searchParams?.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);

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

  const state = useOverlayState();
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const openRenameModal = (id: number, currentTitle: string) => {
    setRenameId(id);
    setRenameTitle(currentTitle);
    state.open();
  };

  const handleRenameSubmit = async () => {
    if (!renameId || !renameTitle.trim()) return;

    try {
      setIsRenaming(true);
      await ChatService.updateConversation(renameId, renameTitle);
      loadConversations();
      state.close();
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
    <aside className="w-64 flex-shrink-0 bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <CompassIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">KelanaAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-4">

        {/* Main Links */}
        <div className="px-4 space-y-1">
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
        </div>

        {/* Conversations History */}
        <div className="px-2 space-y-1">
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Chats
            </p>
            <Link href="/chat">
              <Button size="sm" isIconOnly variant="primary" className="text-white hover:text-white">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-0.5 px-2">
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
                    <Link href={`/chat?id=${conv.id}`} className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 px-3 py-2 text-sm ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                        }`}>
                        <MessageSquareIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{conv.title || "Untitled Chat"}</span>
                      </div>
                    </Link>

                    <Dropdown className="bg-zinc-900 border border-white/10">
                      <Dropdown.Trigger>
                        <div className="p-1 rounded-md cursor-pointer text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors mr-1">
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

      </nav>

      {/* Bottom Actions & User Profile */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {/* User Identity */}
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

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-zinc-950 border border-white/10 text-white">
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
              <Button variant="secondary" className="text-zinc-400 hover:text-white" onPress={state.close}>
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
          <Modal.Dialog className="bg-zinc-950 border border-white/10 text-white">
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

    </aside>
  );
}
