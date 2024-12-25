import { LengthSelectors } from "@/components/length-selector";
import { TimeSelectors } from "@/components/time-selector";
import { TransferBoard } from "@/components/transfer-board";
import { VideoCard } from "@/components/video-card";
import { VideoNavBar } from "@/components/video-navbar";
import { $VT } from "@/store/videotransfer";
import React, { type FC } from "react";

export const Transfer: FC = () => {
  const currentPage = $VT.use((state) => state.curPage);
  const totalPage = $VT.use((state) => state.totalPage);
  return (
    <div className="flex-grow relative mx-8 ">
      <VideoNavBar />
      <div id="video-container" className=" w-full h-4/5 rounded-lg">
        <div id="filter" className="text-white flex mx-5 mb-8 flex-col">
          <TimeSelectors />
          <LengthSelectors />
        </div>
        <div id="line " className="flex mb-5 flex-wrap w-[82vw] mx-auto ">
          <VideoCard time="02:15" />
          <VideoCard time="03:15" />
          <VideoCard time="04:15" />
          <VideoCard time="05:15" isLast />
          <VideoCard time="02:15" />
          <VideoCard time="03:15" />
          <VideoCard time="04:15" />
          <VideoCard time="05:15" isLast />
        </div>

        <div id="pagination" className="w-full flex justify-center ">
          <button
            className={` font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] mr-8 
              ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-button_hover_background"}`}
            onClick={() => {
              if (currentPage !== 1) {
                // todo : 请求上一页内容
                $VT.update("last page", (state) => {
                  state.curPage = state.curPage - 1;
                });
              }
            }}
          >
            上一页
          </button>
          <button className=" font-bold  bg-button_normal_background border-none rounded-xl min-w-12">
            {currentPage}
          </button>
          <button
            className={`font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] ml-8 
              ${currentPage === totalPage ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-button_hover_background"}`}
            onClick={() => {
              if (currentPage !== totalPage) {
                // todo : 请求下一页内容
                $VT.update("last page", (state) => {
                  state.curPage = state.curPage + 1;
                });
              }
            }}
          >
            下一页
          </button>
        </div>
        <TransferBoard />
      </div>
    </div>
  );
};
