import { $VT, type TimeSelector } from "@/store/videotransfer";
import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { RangeTimePicker } from "./time-picker";
export const TimeSelectors: FC = () => {
  const basicClass = " select-none border-none rounded-md  h-8 min-w-[100px] font-bold mr-6  cursor-pointer hover:bg-button_hover_background"
  const curItem = $VT.use((state) => state.timeSelector);
  return (
    <div id="timeSelector">

      <button
        className={twMerge(
          basicClass,
          "alldays" === curItem
            ? "bg-button_normal_background "
            : "bg-[#333A45] text-[#727485]",
        )}
        onClick={() => {
          $VT.update("change selector", (vt) => {
            vt.timeSelector = "alldays";
            vt.customTime = [null, null] // 清空选择的时间
          });
        }}
      >
        全部日期
      </button>
      <RangeTimePicker></RangeTimePicker>
    </div>
  );
};
