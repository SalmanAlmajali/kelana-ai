"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/services/authService";

export default function WelcomeMessage() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      AuthService.getMe()
        .then((res) => {
          if (res.data?.name) {
            setName(res.data.name);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user for welcome message", err);
        });
    };

    fetchUser();

    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      if (!token) setName(null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  if (!name) return null;

  return (
    <div className="hidden sm:block mr-4 text-sm text-foreground/80 font-medium">
      Welcome back,<br/>
      <span className="text-primary font-bold">{name}</span> 👋
    </div>
  );
}
