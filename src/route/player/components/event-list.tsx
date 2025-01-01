import { $PR } from "@/store/player";
import React, { useRef, type FC } from "react";
import { DividerIcon } from "@/assets/icons";
import { DefaultImage } from "@/assets/image";
import styled from "styled-components";
import { TimeLeftButton, TimeRightButton } from "./time-button";

const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;
interface EventListProperty {
  playVideoAt: (second: number) => void
}

export const EventList: FC<EventListProperty> = ({ playVideoAt }) => {
  const videoSrc = $PR.use(state => state.videoSrc)
  const sliceInfoArr = $PR.use(state => state.sliceInfoArr)
  return (

    <div className="w-[300px] h-[572px] mx-auto">
      <div className="p-4 bg-card_background backdrop-blur-[6px] 
        rounded-md border border-solid border-border_card overflow-hidden">
        <div className="text-white flex items-center">
          <TextDiv className="mr-3 bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">事件节点</TextDiv>
          <DividerIcon className="text-sm h-4 fill-[#47d4ff] relative top-[1px]" /></div>
      </div>


      <div className="w-[300px] h-[500px]  overflow-y-scroll scrollbar-hidden">

        {sliceInfoArr.map(info => (
          <div key={info.imgSrc} className="w-[95%] mt-2   rounded-lg relative mx-auto">
            <img src={info.imgSrc} alt="" className="w-[100%] max-h-40 rounded-lg" />
            <TimeLeftButton second={info.beginSecond} playAt={playVideoAt} />
            <TimeRightButton second={info.endSecond} playAt={playVideoAt} />
          </div>)
        )}
      </div>
    </div >
  );
};
