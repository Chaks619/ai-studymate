import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { loginSchema, type LoginForm } from "../auth.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const { login, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "",
        password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    await login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          type="email"
          placeholder="john@example.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Password</Label>

        <Input
          type="password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        className="w-full"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary"
        >
          Register
        </Link>
      </p>
    </form>
  );
}