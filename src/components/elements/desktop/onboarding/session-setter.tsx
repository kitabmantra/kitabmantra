"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SessionSetterProps {
  userName: string;
  email: string;
  userId: string;
}

export default function SessionSetter({ userName, email, userId }: SessionSetterProps) {
  const router = useRouter();

  useEffect(() => {
    const setSession = async () => {
      try {
        console.log("Setting user session for:", { userName, email, userId });
        
        const response = await fetch('/api/set-user-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName,
            email,
            userId
          }),
        });

        const result = await response.json();
        console.log("Session result:", result);
        
        if (result.success) {
          console.log("Session set successfully, redirecting...");
          router.push("/");
        } else {
          console.error("Failed to set user session:", result.error);
          // Still redirect even if session setting fails
          router.push("/");
        }
      } catch (error) {
        console.error("Error setting user session:", error);
        // Still redirect even if there's an error
        router.push("/");
      }
    };

    setSession();
  }, [userName, email, userId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your session...</p>
      </div>
    </div>
  );
} 