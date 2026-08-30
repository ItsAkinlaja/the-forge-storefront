export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex">
      {/* Left panel skeleton */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-20 border-r border-[#EBEBEB] dark:border-[#181818]">
        <div className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-16 animate-pulse" />
        <div className="space-y-4 max-w-md">
          <div className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-24 animate-pulse" />
          <div className="h-16 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-56 animate-pulse" />
          <div className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-full animate-pulse" />
          <div className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-3/4 animate-pulse" />
        </div>
        <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-40 animate-pulse" />
      </div>
      {/* Right panel skeleton */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-16">
        <div className="max-w-sm w-full mx-auto lg:mx-0 space-y-5">
          <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-32 animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-20 animate-pulse" />
            <div className="h-12 bg-[#F0F0F0] dark:bg-[#1A1A1A] animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-20 animate-pulse" />
            <div className="h-12 bg-[#F0F0F0] dark:bg-[#1A1A1A] animate-pulse" />
          </div>
          <div className="h-12 bg-[#F0F0F0] dark:bg-[#1A1A1A] animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}
