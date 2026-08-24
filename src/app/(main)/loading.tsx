export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-12 w-64 max-w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl ring-1 ring-tomato/10 bg-white">
            <div className="skeleton aspect-[4/3]" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-5 w-3/4 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
