export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex">
      <div className="hidden lg:block w-56 bg-surface border-r border-border" />
      <div className="flex-1 flex flex-col p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-8 w-44 bg-gray-200 dark:bg-slate-700 rounded-md" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded-sm" />
                <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full mt-6" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded-sm ml-auto mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

