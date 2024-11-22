export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
} 