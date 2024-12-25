import { $VT, type LengthSelector } from "@/store/videotransfer";
import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
export const LengthSelectors: FC = () => {
  const lengthItems: Array<{ name: string; key: LengthSelector }> = [
    { name: "全部时长", key: "alllength" },
    { name: "1小时内", key: "1hour" },
    { name: "1-4小时", key: "4hour" },
    { name: "4小时以上", key: "4hourup" },
  ];
  const curItem = $VT.use((state) => state.lengthSelector);
  return (
    <div id="timeSelector" className="my-4">
      {lengthItems.map((item) => (
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
              vt.lengthSelector = item.key;
            });
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
