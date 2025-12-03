export default function ColumnSkeleton() {
  return (
    <div className="flex gap-16 px-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[270px] p-3 rounded-md bg-gray-200 duration-300 pb-[80px] animate-pulse"
        >
          <div className="h-5 w-1/2 bg-gray-300 rounded mb-5"></div>
          <div className="h-3 w-1/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-3/4 bg-gray-300 rounded mb-7"></div>

          <div className="h-5 w-2/3 bg-gray-300 rounded mb-5"></div>
          <div className="h-3 w-2/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-1/4 bg-gray-300 rounded mb-7"></div>

          <div className="h-5 w-1/3 bg-gray-300 rounded mb-5"></div>
          <div className="h-3 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-1/4 bg-gray-300 rounded"></div>


        </div>
      ))}
    </div>
  );
}
