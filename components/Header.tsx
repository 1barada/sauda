import Image from "next/image";

import getServerUser from "@/utils/getServerUser";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default async function Header() {
  const user = await getServerUser();

  return (
    <header
      className="
        flex-shrink-0
        flex-grow-0
        basis-10
        flex
        items-center
        justify-between
        bg-slate-200
        p-2
      "
    >
      {user ? (
        <div>
          {user.avatarUrl && (
            <Image
              src={user.avatarUrl}
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
          )}
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}
