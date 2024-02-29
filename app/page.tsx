import Skeleton from "@/components/Skeleton";
import UploadForm from "@/components/form/UploadForm";

export default function Home() {
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