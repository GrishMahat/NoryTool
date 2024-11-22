export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border">
          {children}
        </div>
      </div>
    </div>
  );
}