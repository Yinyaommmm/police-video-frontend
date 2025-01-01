import { $PR } from "@/store/player";
import React, { useRef, type FC } from "react";
import { ItemsIcon, VideoUploadIcon, ForbiddenIcon } from "@/assets/icons";
import { stat } from "fs";
import { api } from "@/api";
import { showMessage } from "@/components/message";
import { createEventsTNURL } from "@/utils";


export const PlayerNavBar: FC = () => {
  const videoName = $PR.use((state) => state.videoName);
  const localVideoRef = useRef<HTMLInputElement>(null)
  const handleLocalVideoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.target.files !== null && e.target.files?.length !== 0) {
      const localVideo = e.target.files[0]
      const videoUrl = URL.createObjectURL(localVideo);

      // 创建一个隐藏的video标签去感知宽高
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = videoUrl;
      video.onloadedmetadata = async function () {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const originPlayerWidth = 935
        const originPlayerHeight = 572
        // 宽占主导
        const widthDominant = width / height > originPlayerWidth / originPlayerHeight
        // 播放视频信息设置
        $PR.update('jol init & upload video to play', (state) => {
          state.videoSrc = videoUrl
          state.videoName = localVideo.name
          state.jolOption = {
            width: widthDominant ? originPlayerWidth : undefined,
            height: widthDominant ? undefined : originPlayerHeight,
            mode: widthDominant ? 'widthFix' : 'heightFix',
            videoSrc: videoUrl,
            isShowWebFullScreen: widthDominant,
            isShowPicture: widthDominant,
            isShowSet: widthDominant,
            theme: "#47d4ff"
          }
        })
        // 如果视频后端存在，获取统计信息和缩略信息
        const res = await api.transfer.statistics(localVideo.name, 200)
        $PR.update('set statastical info', (state) => {
          state.statisticalInfo = res
        })
        const a = await api.transfer.timeEvents(localVideo.name)
        $PR.update('set time events info', state => {
          state.sliceInfoArr = a.map(item => ({
            imgSrc: createEventsTNURL(item.ScreenShot),
            beginSecond: item.StartTime,
            endSecond: item.EndTime,
          }))
        })
        console.log(`视频宽度: ${width}, 视频高度: ${height}`);
      }
    };
  }

  return (
    <div className="mb-2">
      <h2 className="text-white flex mb-2">
        {/* <span className="text-xl ">{videoName.length < + 40 ? videoName : videoName.slice(0, 40) + "..."}</span> */}
        <span className="text-xl ">{videoName}</span>
        <div
          className=" ml-auto mr-4 bg-[#1f2429] border-none  rounded-[1000px] 
        hover:bg-[#2e363d] hover:cursor-pointer"
        >
          <input type="file" hidden
            ref={localVideoRef}
            onChange={handleLocalVideoChange}
            accept="video/*" />
          <div
            className=" relative text-white text-sm font-medium py-1.5 px-4"
            onClick={() => {
              if (localVideoRef.current !== null) {
                localVideoRef.current.click()
              }
            }}
          >
            选择本地视频
          </div>

        </div>
      </h2>
      <div className="flex h-6 items-center ">
        <div className="text-white flex text-xs mr-3"><ItemsIcon className="mr-1" /> <div className="h-5 leading-5">42</div></div>
        <div className="text-white flex text-xs mr-3"><VideoUploadIcon className="mr-1" /> <div className="h-5 leading-5"> 2024-12-16 15:48</div></div>
        <div className="text-white flex text-xs mr-3 items-center"><ForbiddenIcon className="mr-1 text-red-500" /> <div className="h-5 leading-5"> 内部使用，禁止外传</div></div>
      </div>
    </div>
  );
};
