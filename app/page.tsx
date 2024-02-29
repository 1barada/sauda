'use client'

import Skeleton from "@/components/Skeleton";
import UploadForm from "@/components/form/UploadForm";
import useHistory from "@/hooks/useHistory";
import { useEffect } from "react";

export default function Home() {
  const { history } = useHistory();

  useEffect(() => {
    console.log(history)
  }, [history])

  return (
    <div
      className="
        flex-auto
        bg-main
        p-2
        flex
        flex-row
        gap-2
      "
    >
      <Skeleton className="w-[200px] h-[200px] rounded-md"/>
      <Skeleton className="w-[200px] h-[200px] rounded-md"/>
      <Skeleton className="w-[200px] h-[200px] rounded-md"/>
      <UploadForm/>
    </div>
  );
}