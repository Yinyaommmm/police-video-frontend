import { $PR } from "@/store/player";
import React, { useCallback, useEffect, useRef, type FC } from "react";
import { DefaultImage } from "@/assets/image";
import styled from "styled-components";
import { EventList } from "./event-list";
import { motion } from "framer-motion";
import JolPlayer, { JoLPlayerRef } from "jol-player";
import { AreaCharts } from "./area-chart";



export const PlayerBody: FC = () => {
  const videoSrc = $PR.use(state => state.videoSrc)
  const videoRef = useRef<JoLPlayerRef>(null!);
  const statInfo = $PR.use(state => state.statisticalInfo)
  const playVideoAt = useCallback((second: number) => {
    if (videoRef.current) {
      console.log(videoRef.current);

      videoRef.current.seek(second)
      videoRef.current.play()
    }
  }, [videoRef.current]);
  const jolOption = $PR.use(state => state.jolOption)

  return (
    <div >
      <div className="flex ">
        <div className="flex flex-col items-center justify-center w-[935px] h-[572px]">
          {videoSrc !== "" ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="w-[935px] h-[572px] bg-black flex justify-center items-center"  >
              <JolPlayer key="jol-video" ref={videoRef} option={jolOption} />
            </motion.div>

          ) : (
            <motion.div key="default" layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <DefaultImage />
              <div className="text-[#c5c7d5] text-center text-lg select-none">
                请在视频传输页面选择 <span className="text-[#a7ff1a]">服务器端视频  </span>
                或在本页面选择 <span className="text-[#47d4ff]">本地视频</span>
              </div>
            </motion.div >
          )}

        </div>
        <EventList playVideoAt={playVideoAt} />
      </div>

      <div className="w-[935px] h-[40px] " >
        <AreaCharts info={statInfo.info} total_time={statInfo.total_time} split={statInfo.split} click={playVideoAt} ></AreaCharts>
      </div>
    </div >

  );
};
