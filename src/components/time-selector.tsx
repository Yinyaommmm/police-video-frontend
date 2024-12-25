import { $VT, type TimeSelector } from "@/store/videotransfer";
import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
export const TimeSelectors: FC = () => {
  const timeItems: Array<{ name: string; key: TimeSelector }> = [
    { name: "全部日期", key: "alldays" },
    { name: "最近一天", key: "lastday" },
    { name: "最近一周", key: "lastweek" },
    { name: "最近半年", key: "halfyear" },
  ];
  const curItem = $VT.use((state) => state.timeSelector);
  return (
    <div id="timeSelector">
      {timeItems.map((item) => (
        <button
          key={item.key}
          className={twMerge(
            " border-none rounded-md  h-8 min-w-[100px] font-bold mr-6  cursor-pointer hover:bg-button_hover_background",
            item.key === curItem
              ? "bg-button_normal_background "
              : "bg-[#333A45] text-[#727485]",
          )}
          onClick={() => {
            $VT.update("change selector", (vt) => {
              vt.timeSelector = item.key;
            });
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
