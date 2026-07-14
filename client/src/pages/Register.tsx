import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function RegisterPage() {
  return (
    <AuthCard
        title="Create Account"
        subtitle="Start learning smarter with AI"
    >
        <RegisterForm />
    </AuthCard>
  );
}
