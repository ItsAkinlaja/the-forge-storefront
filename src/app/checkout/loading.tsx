export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505]">
      {/* Header skeleton */}
      <header className="border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="h-3 w-24 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
          <div className="h-5 w-28 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
          <div className="h-3 w-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form skeleton */}
            <div className="lg:col-span-7 space-y-5">
              <div className="h-8 w-48 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse mb-8" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2.5 w-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                  <div className="h-12 w-full bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                </div>
              ))}
              <div className="h-14 w-full bg-[#C6A15B]/20 animate-pulse mt-4" />
            </div>

            {/* Summary skeleton */}
            <div className="lg:col-span-5 border border-[#E5E5E5] dark:border-[#262626] p-7 space-y-6">
              <div className="h-6 w-32 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-14 h-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                    <div className="h-2.5 w-16 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                  </div>
                  <div className="h-3 w-16 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                </div>
              ))}
              <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                  <div className="h-3 w-24 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                  <div className="h-3 w-12 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
