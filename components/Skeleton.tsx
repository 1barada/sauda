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
bg-[linear-gradient(110deg,#ededed_35%,rgb(0,0,0,0.01)_45%,rgba(0,0,0,0.03)_50%,#ededed_65%)]
animate-[2s_shine_linear_infinite]
[background-position-x:180%]
`;