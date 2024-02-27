"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { signOut, isLoading } = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
    >
      logout
    </button>
  );
}
