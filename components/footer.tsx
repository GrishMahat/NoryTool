import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Nory . All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 