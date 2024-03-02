'use client'

import Image from "next/image";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";

import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { useAuth } from "@/hooks/useAuth";
import Skeleton from "./Skeleton";
import useHistory from "@/hooks/useHistory";
import Button from "./Button";

export default function Header() {
  const { user, isLoading } = useAuth();
  const { history, currentPage, back, forward } = useHistory(); 

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
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => back()}
          className={`bg-main-200 p-1 rounded-full text-gray-500 cursor-auto disabled:cursor-not-allowed
            ${currentPage === 0 ? '' : 'hover:bg-main-300 hover:text-gray-800'}
          `}
          disabled={currentPage === 0}
        >
          <HiArrowSmLeft 
            className="h-5 w-5" 
          />
        </Button>
        <Button
          onClick={() => forward()}
          className={`bg-main-200 p-1 rounded-full text-gray-500 cursor-auto disabled:cursor-not-allowed
            ${currentPage === history.length - 1 ? '' : 'hover:bg-main-300 hover:text-gray-800'}
          `}
          disabled={currentPage === history.length - 1}
        >
          <HiArrowSmRight 
            className="h-5 w-5" 
          />
        </Button>
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
