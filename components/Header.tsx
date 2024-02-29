'use client'

import Image from "next/image";

import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { useAuth } from "@/hooks/useAuth";
import Skeleton from "./Skeleton";

export default function Header() {
  const {user, isLoading} = useAuth();

  return (
    <header
      className="
        flex-shrink-0
        flex-grow-0
        basis-12
        flex
        items-center
        justify-between
        bg-main
        py-1
        px-4
      "
    >
      <div>
        back
        forward
      </div>
      <div className="flex flex-row items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="w-16 h-5 rounded-md"/> 
            <Skeleton className="w-9 h-9 rounded-full"/>
          </>
        ) : (
          user ? (
            <>
              <LogoutButton />
              {user.avatarUrl && (
                <Image src={user.avatarUrl} alt="avatar" width={36} height={36} className="rounded-full"/>
              )}
            </>
          ) : (
            <LoginButton />
          )
        )}

      </div>
    </header>
  );
}
