import { $VT } from "@/store/videotransfer";
import React, { type FC } from "react";

export const VideoNavBar: FC = () => {

  const taskLength = $VT.use(state => state.transferArray.length)
  return (
    <h2 className="text-white flex ">
      <span className="text-lg ">视频库</span>
      <div
        className=" ml-auto mr-4 bg-[#1f2429] border-none  rounded-[1000px] 
        hover:bg-[#2e363d] hover:cursor-pointer"
      >
        <div
          className=" relative text-white text-sm font-medium py-1.5 px-4"
          onClick={() => {
            $VT.update("toggle transfer board", (state) => {
              state.boardVisible = !state.boardVisible;
            });
          }}
        >
          传输任务面板
          { taskLength > 0 && <div className="absolute -top-2 -left-2 text-red-50 bg-red-500 rounded-full w-5 h-5 
           text-xs flex justify-center items-center">{taskLength}</div>}
        </div>

      </div>
    </h2>
  );
};
