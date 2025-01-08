import { $PR } from "@/store/player";
import { ReactHTMLElement, useCallback, useEffect, useLayoutEffect, useRef, type FC } from "react";
import { DefaultImage } from "@/assets/image";
import { EventList } from "./event-list";
import { motion } from "framer-motion";
import JolPlayer, { JoLPlayerRef, videoAttributes } from "jol-player";
import { AreaCharts } from "./area-chart";
import { TagSpan } from "./tag-button";
import { ChartMask } from "./chart-mask";
import { api } from "@/api";
import { BackEndIP } from "@/config";
import { calcNeedTime, createEventsTNURL } from "@/utils";

export const PlayerBody: FC = () => {
  const videoSrc = $PR.use(state => state.jolOption.videoSrc)
  const videoName = $PR.use(state => state.videoName)
  const videoContainer = $PR.use(state => state.videoContainer)
  const videoRef = useRef<JoLPlayerRef>(null!);
  const statInfo = $PR.use(state => state.statisticalInfo)
  const playVideoAt = useCallback((second: number) => {
    if (videoRef.current) {
      videoRef.current.seek(second)
      videoRef.current.play()
    }
  }, [videoRef.current]);
  const jolOption = $PR.use(state => state.jolOption)
  const tagInfo = $PR.use(state => state.tagInfo)

  // 控制宽高
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleResize = () => {
      console.log(containerRef.current, videoContainer)
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        $PR.update('set video container h&w', (state) => {
          state.videoContainer = {
            width, height
          }

        })
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [videoContainer.width, videoContainer.height]);

  // 当视频名字变化时加载视频
  const containerWidth = $PR.use(state => state.videoContainer.width)
  const containerHeight = $PR.use(state => state.videoContainer.height)
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
    const aspect = 1.77
    // 宽占主导
    const widthDominant = width / height > aspect
    $PR.update('set together', (state) => {
      // 视频
      state.playProgressRatio = 0
      console.log(containerWidth)
      console.log(containerHeight)
      state.jolOption = {
        width: widthDominant ? containerWidth : undefined,
        height: widthDominant ? undefined : containerHeight,
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
  }, [videoName, containerWidth, containerHeight])

  return (
    <div >
      <div className="flex ">
        <div id="yb" className="w-full h-full overflow-x-hidden overflow-y-scroll  scrollbar-none" >
          {videoSrc !== "" ? (
            <motion.div
              id="oopp"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="min-w-[668px] min-h-[376px] max-w-full aspect-[1.77] mr-4
               bg-black flex justify-center items-center" ref={containerRef}  >
              <JolPlayer key="jol-video" ref={videoRef} option={jolOption}
                onTimeChange={(v: videoAttributes) => {
                  $PR.update('play progress', (state) => {
                    state.playProgressRatio = v.currentTime / v.duration
                  })
                }} />
            </motion.div>
          ) : (
            <motion.div className="w-[520px] mx-auto mt-[200px]" key="default" layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <DefaultImage />
              <div className="text-[#c5c7d5] text-center text-lg select-none">
                请在视频传输页面选择 <span className="text-[#a7ff1a]">服务器端视频  </span>
                或在本页面选择 <span className="text-[#47d4ff]">本地视频</span>
              </div>
            </motion.div >
          )}
          <div className="w-full h-10 relative mt-2" >
            <AreaCharts processed_time={statInfo.processed_time} info={statInfo.info} total_time={statInfo.total_time} split={statInfo.split} click={playVideoAt} />
            <ChartMask ></ChartMask>
          </div>
          <div className="w-full h-10 mt-2 flex items-center" >
            {tagInfo.map(info => <TagSpan key={info} content={info}></TagSpan>)}
          </div>
        </div>
        <EventList playVideoAt={playVideoAt} />
      </div>
    </div >

  );
};

