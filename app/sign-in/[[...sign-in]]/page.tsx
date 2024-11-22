/** @format */

import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none p-0",
            formButtonPrimary: 
              "bg-blue-500 hover:bg-blue-600 text-white transition-colors",
            footerActionLink: "text-blue-500 hover:text-blue-600",
            formFieldInput: 
              "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
            dividerLine: "dark:border-gray-700",
            dividerText: "dark:text-gray-400",
            socialButtonsBlockButton: 
              "dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700",
            socialButtonsBlockButtonText: "dark:text-white",
          },
        }}
      />
    </AuthLayout>
  );
}
