import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";

export interface HistoryProps {
  className?: string;
}
export const History: FC<HistoryProps> = ({ className }) => {
  return (
    <div className={twMerge("h-full", className)}>
      <div className="h-[calc(100%-61px)] w-[120px] rounded-t-2xl border border-solid border-b-0 border-[#2e3136] pt-4 pb-[15px] px-[15px]">
        <div className="h-6">
          <div className="text-base text-white font-bold">历史</div>
        </div>
      </div>
    </div>
  );
};
