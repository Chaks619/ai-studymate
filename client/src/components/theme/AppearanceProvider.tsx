import { useEffect, type PropsWithChildren } from "react";
import { useTheme } from "next-themes";

import { useAppSelector } from "@/app/hooks";
import { applyAppearance } from "@/lib/appearance";

/**
 * Pushes the signed-in user's saved appearance onto the document: theme via
 * next-themes, accent and font size via data attributes on <html>.
 *
 * It deliberately does nothing until a user exists. Before the session
 * restores, whatever main.tsx read out of localStorage stands — syncing the
 * defaults over it would flash the wrong theme on every reload.
 */
export function AppearanceProvider({ children }: PropsWithChildren) {
  const preferences = useAppSelector((state) => state.auth.user?.preferences);

  const { setTheme } = useTheme();

  const theme = preferences?.theme;
  const accentColor = preferences?.accentColor;
  const fontSize = preferences?.fontSize;

  useEffect(() => {
    if (!theme) return;

    setTheme(theme);
  }, [theme, setTheme]);

  useEffect(() => {
    if (!accentColor || !fontSize) return;

    applyAppearance({ accentColor, fontSize });
  }, [accentColor, fontSize]);

  return <>{children}</>;
}
