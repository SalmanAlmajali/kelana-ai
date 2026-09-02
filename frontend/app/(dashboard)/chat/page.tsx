import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

export const metadata = {
  title: "Chat | KelanaAI",
};

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto py-8 sm:py-12 animate-fade-in">
      <ChatClient />
    </div>
  );
}
