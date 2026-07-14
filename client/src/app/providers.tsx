import type { PropsWithChildren } from "react";

import { Provider } from "react-redux";

import { store } from "./store";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({
  children,
}: PropsWithChildren) {
  return (
    <Provider store={store}>
        <AuthInitializer>
            {children}
            <Toaster richColors position="top-right" />
        </AuthInitializer>
    </Provider>
  );
}