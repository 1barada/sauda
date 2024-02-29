interface SkeletonProps {
  className: string; 
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`${className} ${styles}`}></div>
  );
}

const styles = `
bg-[length:200%_100%]
bg-[#DCDCDC]
bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_15%,rgba(255,255,255,0.5)_35%,rgba(255,255,255,0)_45%)]
animate-[1.5s_shine_linear_infinite]
[background-position-x:180%]
`;