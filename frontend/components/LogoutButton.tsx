"use client";

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // TELL STUDENTS:
    // Because JWT is stateless, the backend doesn't track sessions.
    // Logout happens entirely on the client — remove the stored token and redirect.
    // The token itself is still valid until expiry — that's why short expiry times matter.
    
    // 1. Remove JWT from localStorage
    localStorage.removeItem("token");
    
    // 2. Remove JWT from cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Dispatch event to clear React state in other components
    window.dispatchEvent(new Event("auth-change"));

    // 3. Redirect to /login
    router.push("/login");
  };

  return (
    <Button 
      variant="light" 
      size="sm" 
      color="danger"
      onClick={handleLogout}
      className="ml-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
      </svg>
      Logout
    </Button>
  );
}
