"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-sm text-white">
            A
          </div>
          <span className="text-[15px] font-semibold tracking-tight hidden sm:block">
            Adiyogi AI
          </span>
        </div>
      </div>
    </header>
  );
}
