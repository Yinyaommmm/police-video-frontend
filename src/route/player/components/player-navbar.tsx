import { $PR } from "@/store/player";
import React, { useEffect, useRef, type FC } from "react";
import { ItemsIcon, VideoUploadIcon, ForbiddenIcon } from "@/assets/icons";
import { api } from "@/api";
import { calcNeedTime, createEventsTNURL } from "@/utils";
import { BackEndIP } from "@/config";


export const PlayerNavBar: FC = () => {
  const videoName = $PR.use((state) => state.videoName);
  const eventsNum = $PR.use(state => state.sliceInfoArr.length)
  const localVideoRef = useRef<HTMLInputElement>(null)
  // 当视频名字变化时加载视频
  const loadVideo = async (videoName: string) => {
    // 获取视频宽高、统计信息、事件
    if (videoName === "等待选择视频......") {
      return;
    }
    const [statRes, eventRes, whRes] = await Promise.all([
      api.transfer.statistics(videoName, 200),
      api.transfer.timeEvents(videoName),
      api.transfer.widthAndHeight(videoName)])

    // 设置视频播放器
    const { width, height } = whRes
    const originPlayerWidth = 935
    const originPlayerHeight = 572
    // 宽占主导
    const widthDominant = width / height > originPlayerWidth / originPlayerHeight
    $PR.update('set together', (state) => {
      // 视频
      state.playProgressRatio = 0
      state.jolOption = {
        width: widthDominant ? originPlayerWidth : undefined,
        height: widthDominant ? undefined : originPlayerHeight,
        mode: widthDominant ? 'widthFix' : 'heightFix',
        videoSrc: `${BackEndIP}api/v1/video_s/video_stream?video_name=${videoName}`,
        isShowWebFullScreen: false,
        isShowPicture: widthDominant,
        isShowSet: widthDominant,
        theme: "#47d4ff",
      }
      // 统计信息
      state.statisticalInfo = {
        total_time: statRes.total_time,
        split: statRes.split,
        info: statRes.info.slice(0, Math.min(200, statRes.total_time)),
        processed_time: statRes.processed_time
      }
      // 右侧事件
      state.sliceInfoArr = eventRes.map(item => ({
        imgSrc: createEventsTNURL(item.ScreenShot),
        beginSecond: item.StartTime,
        endSecond: item.EndTime,
      }))
      // tag
      state.tagInfo = [
        `原始时长 ${calcNeedTime(statRes.total_time)}`,
        `压缩后时长 ${calcNeedTime(statRes.processed_time)}`,
        `事件总数 ${eventRes.length}`,
        `运动事件 ${(eventRes.filter(i => i.Event === "运动").length)}`,
      ]
    })
  }

  useEffect(() => {
    loadVideo(videoName)

  }, [videoName])

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
          state.videoName = localVideo.name
          state.jolOption = {
            width: widthDominant ? originPlayerWidth : undefined,
            height: widthDominant ? undefined : originPlayerHeight,
            mode: widthDominant ? 'widthFix' : 'heightFix',
            videoSrc: videoUrl,
            isShowWebFullScreen: false,
            isShowPicture: widthDominant,
            isShowSet: widthDominant,
            theme: "#47d4ff"
          }
        })
        // 如果视频后端存在，获取统计信息和缩略信息
        const [statRes, eventRes] = await Promise.all([
          api.transfer.statistics(localVideo.name, 200),
          api.transfer.timeEvents(localVideo.name)])
        $PR.update('set statastical info', (state) => {
          state.statisticalInfo = statRes
        })
        $PR.update('set time events info', state => {
          state.sliceInfoArr = eventRes.map(item => ({
            imgSrc: createEventsTNURL(item.ScreenShot),
            beginSecond: item.StartTime,
            endSecond: item.EndTime,
          }))
        })
        $PR.update('set tag info', (state) => {
          state.tagInfo = [
            `原始时长 ${calcNeedTime(statRes.total_time)}`,
            `压缩后时长 ${calcNeedTime(statRes.processed_time)}`,
            `事件总数 ${eventRes.length}`,
            `运动事件 ${(eventRes.filter(i => i.Event === "运动").length)}`,
            // `YOLO ${eventRes.filter(i => i.Method === "YOLO").length}`,
            // `FrameDiff ${eventRes.filter(i => i.Method === "FrameDiff").length}`
          ]
        })
      };
    }
  }
  return (
    <div className="mb-2">
      <h2 className="text-white flex mb-2">
        <span className="text-xl ">{videoName.length < + 50 ? videoName : videoName.slice(0, 50) + "..."}</span>
        {/* <div
          className=" ml-auto mr-4 bg-[#1f2429] border-none  rounded-[1000px] 
        hover:bg-[#2e363d] hover:cursor-pointer"
        >
          <input type="file" hidden
            ref={localVideoRef}
            // onChange={handleLocalVideoChange}
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

        </div> */}
      </h2>
      <div className="flex h-6 items-center ">
        <div className="text-white flex text-xs mr-3"><ItemsIcon className="mr-1" /> <div className="h-5 leading-5">{eventsNum > 0 ? eventsNum : '...'}</div></div>
        <div className="text-white flex text-xs mr-3"><VideoUploadIcon className="mr-1" /> <div className="h-5 leading-5"> 2024-12-16 15:48(视频上传日期)</div></div>
        <div className="text-white flex text-xs mr-3 items-center"><ForbiddenIcon className="mr-1 text-red-500" /> <div className="h-5 leading-5"> 内部使用，禁止外传</div></div>
      </div>
    </div>
  );
};
