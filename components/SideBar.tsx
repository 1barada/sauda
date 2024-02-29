import Link from "next/link";

export default function SideBar() {
  return (
    <div
      className="
        flex
        flex-col
      "
    >
      <h1
        className="
          flex-shrink-0
          flex-grow-0
          basis-10
          bg-main
          text-2xl
          p-4
        "
      >
        <Link href="/">Sauda</Link>
      </h1>
      <div className="flex-auto bg-main"></div>
    </div>
  );
}
