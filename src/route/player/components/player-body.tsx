import { $PR } from "@/store/player";
import { ReactHTMLElement, useCallback, useEffect, useLayoutEffect, useRef, useState, type FC } from "react";
import { DefaultImage } from "@/assets/image";
import { EventList } from "./event-list";
import { motion } from "framer-motion";
import JolPlayer, { JoLPlayerRef, videoAttributes } from "jol-player";
import { AreaCharts } from "./area-chart";
import { TagSpan } from "./tag-button";
import { ChartMask } from "./chart-mask";
import { api } from "@/api";
import { calcNeedTime, createEventsTNURL, debounce } from "@/utils";

export const PlayerBody: FC = () => {
  const videoSrc = $PR.use(state => state.jolOption.videoSrc)
  const videoName = $PR.use(state => state.videoName)
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
  const [videoWidth, setVideoWidth] = useState<number>(1200)

  // 控制宽高
  const containerRef = useRef<HTMLDivElement>(null);

  // 当视频名字变化时加载视频
  const loadVideo = debounce(async (videoName: string) => {
    // 获取视频宽高、统计信息、事件
    if (videoName === "等待选择视频......") {
      return;
    }
    const [statRes, eventRes, whRes] = await Promise.all([
      api.transfer.statistics(videoName, 200),
      api.transfer.timeEvents(videoName),
      api.transfer.widthAndHeight(videoName)])

    // 设置视频播放器
    const { width, height } = whRes // 原始视频的宽高
    const { width: containerWidth, height: containerHeight } = containerRef.current?.getBoundingClientRect() || {}
    const aspect = 1.77
    // 宽占主导
    const widthDominant = width / height > aspect
    // console.log('设置视频宽高时 container w h', containerWidth, containerHeight)
    $PR.update('set together', (state) => {
      // 视频
      state.playProgressRatio = 0
      state.jolOption = {
        width: containerWidth,
        height: containerHeight,
        mode: 'widthFix',
        videoSrc: `api/v1/video/video_stream?video_name=${videoName}`,
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
  }, 50)

  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width
      const containerHeight = Math.floor((containerWidth) / 1.77)
      containerRef.current.style.height = `${containerHeight}px`
      // console.log('设置了高度', containerHeight, '宽度', containerWidth, 'ratio', containerWidth / containerHeight)
      // console.log('c', videoRef.current ?? null)
      setVideoWidth(containerWidth)
      loadVideo(videoName)
    } else {
      console.log('log null ref');
    }
  }, [containerRef.current, videoName])

  // 调整
  useLayoutEffect(() => {
    const startTime = new Date()
    const interval = setInterval(() => {
      const ele = document.querySelector('#JoL-player-container') as HTMLDivElement
      const now = new Date()
      const delta = now.getTime() - startTime.getTime()
      if (delta > 2000) {
        console.log('rectify time exceed')
        clearInterval(interval)
      }
      if (ele === null || containerRef.current === null) {
        return
      }
      const { width, height } = containerRef.current?.getBoundingClientRect()
      if (ele!.style.height !== `${containerRef.current?.getBoundingClientRect().height}px`) {
        ele!.style.width = width + 'px'
        ele!.style.height = height + 'px'
        console.log('do rectification')
        clearInterval(interval)
      }
    }, 100);
  })
  return (
    <div className=" w-full">
      {/* <button className="absolute w-10 h-10 bg-red-300 z-50" onClick={() => {
        const { width: containerWidth, height: containerHeight } = containerRef.current?.getBoundingClientRect() || {}
        console.log(containerWidth, containerHeight)
      }}>获取信息</button>
      <button className="absolute w-10 h-10 bg-red-300 z-50 left-40" onClick={() => {
        console.log(jolOption)

      }}>获取信息</button> */}
      <div className="flex w-full justify-between">
        <div className=" h-auto overflow-x-hidden overflow-y-scroll  scrollbar-none flex-1 max-w-[1200px]  min-w-[800px]" >
          <div id="video-container" className="min-w-[668px]  my-0 flex" ref={containerRef} >
            {videoSrc !== "" && containerRef.current !== null ? (
              <motion.div
                id="motiondiv"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className=" w-full h-full  mx-auto
               bg-black flex justify-center items-center"   >
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
          </div>
          <div className="w-full h-10 relative mt-2" >
            <AreaCharts processed_time={statInfo.processed_time} info={statInfo.info} total_time={statInfo.total_time} split={statInfo.split} click={playVideoAt} />
            <ChartMask ></ChartMask>
          </div>
          <div className="w-full h-10 mt-2 flex items-center" >
            {tagInfo.map(info => <TagSpan key={info} content={info}></TagSpan>)}
          </div>
        </div>
        <EventList playVideoAt={playVideoAt} height={
          containerRef.current ?
            containerRef.current.getBoundingClientRect().height + 40 + 40 : 652} style={{ width: `calc(100vw - 200px - 32px - 20px - ${videoWidth}px)` }} />
      </div>
    </div >

  );
};

