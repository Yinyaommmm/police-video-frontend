import { $VT } from "@/store/videotransfer";
import React, { type FC } from "react";

export const VideoNavBar: FC = () => {
  return (
    <h2 className="text-white flex ">
      <span className="text-lg ">视频库</span>
      <div
        className=" ml-auto mr-4 bg-[#1f2429] border-none  rounded-[1000px] 
        hover:bg-[#2e363d] hover:cursor-pointer"
      >
        <div
          className=" text-white text-sm font-medium py-1.5 px-4"
          onClick={() => {
            $VT.update("toggle transfer board", (state) => {
              state.boardVisible = !state.boardVisible;
            });
          }}
        >
          传输任务面板
        </div>
      </div>
    </h2>
  );
};
