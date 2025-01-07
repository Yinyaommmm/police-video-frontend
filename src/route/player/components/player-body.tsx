import { $PR } from "@/store/player";
import { useCallback, useRef, type FC } from "react";
import { DefaultImage } from "@/assets/image";
import { EventList } from "./event-list";
import { motion } from "framer-motion";
import JolPlayer, { JoLPlayerRef } from "jol-player";
import { AreaCharts } from "./area-chart";
import { TagSpan } from "./tag-button";



export const PlayerBody: FC = () => {
  const videoSrc = $PR.use(state => state.jolOption.videoSrc)
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
  return (
    <div >
      <div className="flex h-[672px] ">
        <div className="w-[935px] h-full overflow-x-hidden overflow-y-scroll  scrollbar-none" >
          {videoSrc !== "" ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="w-[935px] h-[572px] bg-black flex justify-center items-center"  >
              <JolPlayer key="jol-video" ref={videoRef} option={jolOption} />
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
          <div className="w-[935px] h-[40px] " >
            <AreaCharts processed_time={statInfo.processed_time} info={statInfo.info} total_time={statInfo.total_time} split={statInfo.split} click={playVideoAt} />
          </div>
          <div className="w-[935px] h-[40px] mt-2 flex items-center" >
            {tagInfo.map(info => <TagSpan key={info} content={info}></TagSpan>)}
          </div>
        </div>
        <EventList playVideoAt={playVideoAt} />
      </div>
    </div >

  );
};
