import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue to AI StudyMate"
    >
      <LoginForm />
    </AuthCard>
  );
}