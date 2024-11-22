/** @format */

"use client";

import { SignInButton, SignedOut, UserButton, SignedIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { NoryLogo } from "./ui/nory-logo";
import { ThemeToggle } from "./theme-toggle";
import { LoadingSpinner } from "./ui/loading-spinner";

export function NavbarContent() {
  const { isLoaded } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <NoryLogo size={32} />
          <span className="text-xl font-bold text-foreground">NoryTool</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoaded ? (
            <LoadingSpinner />
          ) : (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
