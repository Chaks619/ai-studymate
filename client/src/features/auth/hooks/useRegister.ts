import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/services/api/auth.api";
import type { RegisterRequest } from "@/types/api/auth.types";

export function useRegister() {
  const navigate = useNavigate();

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const register = async (data: RegisterRequest) => {
    try {
      await registerMutation(data).unwrap();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    register,
    isLoading,
  };
}