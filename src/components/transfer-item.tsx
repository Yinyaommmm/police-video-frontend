import { DownloadIcon, UploadIcon } from "@/assets/icons";
import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";

export interface TransferItemProps {
  type: "up" | "down";
  title: string;
  size: string;
  speed: string;
  needTime: string;
  progress: number;
}
export const TransferItem: FC<TransferItemProps> = ({
  type,
  title,
  size,
  speed,
  needTime,
  progress,
}) => {
  const dynamicWidth = `${Math.floor(progress * 320)}px`;
  return (
    <div
      className="bg-black/20 backdrop-blur-md shadow-lg
         w-11/12 h-16 rounded-lg flex items-center box-border 
         px-2 mx-auto mb-2 flex-shrink-0
      "
    >
      {type === "up" ? (
        <UploadIcon className="w-auto h-12 text-1xl text-white" />
      ) : (
        <DownloadIcon className="w-auto h-12 text-1xl text-white" />
      )}

      <div data-type="rightContent" className="w-80 h-14  mx-auto">
        <div className="text-white h-7 w-full leading-7 line-clamp-1">
          {title}
        </div>
        <div
          data-type="description"
          className="text-white text-xs h-3 flex justify-between"
        >
          <span>{size}</span>
          <span>{speed}</span>
          <span>{needTime}</span>
        </div>
        <div
          id="progressBar"
          // className={twMerge(
          //   "text-white mt-2 h-1 bg-button_normal_background rounded-md",
          //   dynamicWidth,
          // )}
          className={`text-white mt-2 h-1 bg-button_normal_background rounded-md`}
          style={{ width: dynamicWidth }}
        ></div>
      </div>
    </div>
  );
};
