import { $PR } from "@/store/player";
import React, { useRef, type FC } from "react";
import { ItemsIcon, VideoUploadIcon, ForbiddenIcon } from "@/assets/icons";

export const PlayerNavBar: FC = () => {
  const videoName = $PR.use((state) => state.videoName);
  const localVideoRef = useRef<HTMLInputElement>(null)
  const handleLocalVideoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.target.files !== null && e.target.files?.length !== 0) {
      const localVideo = e.target.files[0]
      const videoUrl = URL.createObjectURL(localVideo);
      $PR.update("upload video to play", (state) => {
        state.videoName = localVideo.name
        state.videoSrc = videoUrl;
        // 暂时mock一下
        state.sliceInfoArr = [{
          imgSrc: "src/assets/fortest/2s.png",
          beginSecond: 2,
          endSecond: 4
        }, {
          imgSrc: "src/assets/fortest/7s.png",
          beginSecond: 7,
          endSecond: 8
        }, {
          imgSrc: "src/assets/fortest/15s.png",
          beginSecond: 15,
          endSecond: 18
        }]
      })
    }
  }
  return (
    <div className="mb-2">
      <h2 className="text-white flex mb-2">
        <span className="text-xl ">{videoName.length < + 40 ? videoName : videoName.slice(0, 40) + "..."}</span>
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
