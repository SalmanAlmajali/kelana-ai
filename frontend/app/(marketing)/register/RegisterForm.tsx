"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, TextField, Input, Button, Label } from "@heroui/react";
import Link from "next/link";
import { AuthService } from "@/services/authService";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await AuthService.register(name as string, email as string, password as string);

      // Automatically log in the user or redirect them to the login page.
      // Usually, registration APIs don't return an access token directly, 
      // they just return a success message or user data. We will redirect to login.
      router.push("/login");
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
        <TextField className="w-full" isRequired name="name" type="text">
          <Label>Name</Label>
          <Input
            placeholder="Alice"
            variant="secondary"
            className="w-full"
          />
        </TextField>

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
          Register
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </Form>
  );
}
