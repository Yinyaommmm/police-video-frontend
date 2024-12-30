import { $PR } from "@/store/player";
import React, { useCallback, useEffect, useRef, type FC } from "react";
import { ItemsIcon, VideoUploadIcon, ForbiddenIcon, DividerIcon } from "@/assets/icons";
import { DefaultImage } from "@/assets/image";
import styled from "styled-components";
import { EventList } from "./event-list";
import { AnimatePresence, motion } from "framer-motion";
import { posix } from "path";

const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

export const PlayerBody: FC = () => {
  const videoSrc = $PR.use(state => state.videoSrc)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playVideoAt = useCallback((second: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = second;
      videoRef.current.play();
    }
  }, []);
  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-[935px] h-[572px]">
        {videoSrc !== "" ? (
          <motion.video
            key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            src={videoSrc} ref={videoRef} className="w-[935px] h-[572px] bg-black" controls ></motion.video>
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
  );
};
