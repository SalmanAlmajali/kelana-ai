import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">KelanaAI</h1>
          <p className="text-muted-foreground">Welcome back</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
