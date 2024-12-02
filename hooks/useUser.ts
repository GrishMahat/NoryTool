import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UserData {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
  };
}

export function useUser() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    }

    fetchUser();
  }, [userId]);

  return { user: userData, loading };
} 