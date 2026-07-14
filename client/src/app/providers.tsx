import type { PropsWithChildren } from "react";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";

import { store } from "./store";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { AppearanceProvider } from "@/components/theme/AppearanceProvider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({
  children,
}: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthInitializer>
          <AppearanceProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AppearanceProvider>
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}