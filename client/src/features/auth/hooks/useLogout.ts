import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../auth.slice";
import { useLogoutMutation } from "@/services/api/auth.api";

export function useLogout() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } finally {
      dispatch(logoutAction());

      navigate("/login");
    }
  };

  return logout;
}