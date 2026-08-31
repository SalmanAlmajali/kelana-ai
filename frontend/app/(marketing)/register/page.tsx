import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">KelanaAI</h1>
          <p className="text-muted-foreground">Create an account</p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
