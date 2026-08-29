"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, TextField, Input, Button, Label } from "@heroui/react";
import Link from "next/link";
import { AuthService } from "@/services/authService";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const data = await AuthService.login(email as string, password as string);

      // Store the JWT in localStorage for client-side use
      localStorage.setItem("token", data.data.access_token);

      // Store the JWT in a cookie for middleware access
      document.cookie = `token=${data.data.access_token}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect to /trips after successful login
      router.push("/trips");
    } catch (err: any) {
      console.log(err);

      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      className="rounded-3xl bg-surface backdrop-blur-xl border border-border shadow-2xl p-6 sm:p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 w-full">
        <TextField className="w-full" isRequired name="email" type="email">
          <Label>Email</Label>
          <Input
            placeholder="alice@email.com"
            variant="secondary"
            className="w-full"
          />
        </TextField>

        <TextField className="w-full" isRequired name="password" type="password">
          <Label>Password</Label>
          <Input
            placeholder="••••••••"
            variant="secondary"
            className="w-full"
          />
        </TextField>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          type="submit"
          isPending={isLoading}
          fullWidth
        >
          Login
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </Form>
  );
}
