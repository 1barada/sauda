'use client'

import NavigationLink from "./NavigationLink";

export default function SideBar() {
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
        <NavigationLink href='/'>Sauda</NavigationLink>
      </h1>
      <div className="flex-auto bg-main flex flex-col gap-6">
        <NavigationLink href='/dashboard'>dashboard</NavigationLink>
        <NavigationLink href='/profile'>profile</NavigationLink>
      </div>
    </div>
  );
}
