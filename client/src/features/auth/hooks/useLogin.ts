import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "@/services/api/auth.api";

import { setCredentials } from "../auth.slice";

import type { LoginRequest } from "@/types/api/auth.types";

export function useLogin() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loginMutation, { isLoading }] =
    useLoginMutation();

  const login = async (
    credentials: LoginRequest
  ) => {
    try {
      const response =
        await loginMutation(credentials).unwrap();

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        })
      );

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    login,
    isLoading,
  };
}