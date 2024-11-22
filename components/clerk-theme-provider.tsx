"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark} from "@clerk/themes";
import { useTheme } from "./theme-provider";

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorBackground: theme === "dark" ? "#111827" : "#ffffff",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
} 