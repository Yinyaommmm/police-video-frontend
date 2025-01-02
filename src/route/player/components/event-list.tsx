import { $PR } from "@/store/player";
import { type FC } from "react";
import { DividerIcon } from "@/assets/icons";
import styled from "styled-components";
import { TimeLeftButton, TimeRightButton } from "./time-button";
import { motion } from "framer-motion";

const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;
interface EventListProperty {
  playVideoAt: (second: number) => void
}

// 动画配置
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const EventList: FC<EventListProperty> = ({ playVideoAt }) => {
  const sliceInfoArr = $PR.use(state => state.sliceInfoArr)
  return (

    <div className="w-[300px] h-[652px] mx-auto">
      <div className="p-4 bg-card_background backdrop-blur-[6px]  
        rounded-md border border-solid border-border_card overflow-hidden">
        <div className="text-white flex items-center">
          <TextDiv className="mr-3 bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">事件节点</TextDiv>
          <DividerIcon className="text-sm h-4 fill-[#47d4ff] relative top-[1px]" /></div>
      </div>


      <motion.div
        className="w-[300px] h-[calc(100%-55px)] overflow-y-scroll overflow-x-hidden custom-scrollbar
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sliceInfoArr.map((info, index) => (
          <motion.div
            key={info.imgSrc}
            className="w-[95%] mt-2 rounded-lg relative mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 1.2, delay: index * 0.14 }}
          >
            <img src={info.imgSrc} alt="" className="w-[100%] max-h-40 rounded-lg" />
            <TimeLeftButton second={info.beginSecond} playAt={playVideoAt} />
            <TimeRightButton second={info.endSecond} playAt={playVideoAt} />
          </motion.div>
        ))}
      </motion.div>
    </div >
  );
};
