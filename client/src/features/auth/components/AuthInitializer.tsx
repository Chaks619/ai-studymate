import { PropsWithChildren, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRefreshMutation } from "@/services/api/auth.api";

import {
  initialize,
  logout,
  setCredentials,
} from "../auth.slice";

export function AuthInitializer({
  children,
}: PropsWithChildren) {
  const dispatch = useDispatch();

  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refresh().unwrap();

        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          })
        );
      } catch {
        dispatch(logout());
      } finally {
        dispatch(initialize());
      }
    };

    restoreSession();
  }, [dispatch, refresh]);

  return <>{children}</>;
}