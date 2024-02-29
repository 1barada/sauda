'use client'

import useHistory from "@/hooks/useHistory";
import Button from "./Button";

export default function SideBar() {
  const { push } = useHistory();

  return (
    <div
      className="
        flex
        flex-col
        divide-y
      "
    >
      <h1
        className="
          flex-shrink-0
          flex-grow-0
          basis-12
          bg-main
          text-2xl
          p-1
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <Button onClick={() => push('/')}>Sauda</Button>
      </h1>
      <div className="flex-auto bg-main flex flex-col gap-6">
        <Button onClick={() => push('/dashboard')}>dashboard</Button>
        <Button onClick={() => push('/profile')}>profile</Button>
      </div>
    </div>
  );
}
