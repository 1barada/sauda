"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LogoutButton() {
  const { signIn } = useAuth();

  return (
    <button
      onClick={async () => {
        await signIn();
        console.log("hello world");
      }}
    >
      login
    </button>
  );
}
