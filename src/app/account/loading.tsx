import { Container } from "@/components/ui/Container";

export default function AccountLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505]">
      {/* Header band skeleton */}
      <div className="border-b border-[#EBEBEB] dark:border-[#181818] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <Container className="py-10 sm:py-14 space-y-3">
          <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-20 animate-pulse" />
          <div className="h-8 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-48 animate-pulse" />
          <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-64 animate-pulse" />
        </Container>
      </div>
      <Container className="py-12">
        {/* Tabs skeleton */}
        <div className="flex gap-0 border-b border-[#EBEBEB] dark:border-[#181818] mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-16 mx-4 my-3 animate-pulse"
            />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="max-w-md space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-24 animate-pulse" />
              <div className="h-12 bg-[#F0F0F0] dark:bg-[#1A1A1A] animate-pulse" />
            </div>
          ))}
          <div className="h-10 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-32 animate-pulse mt-4" />
        </div>
      </Container>
    </div>
  );
}
