import { $PR, SliceInfo } from "@/store/player";
import { HTMLProps, FC, useRef, useEffect, useState } from "react";
import { DividerIcon } from "@/assets/icons";
import styled from "styled-components";
import { TimeLeftButton, TimeRightButton } from "./time-button";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { VariableSizeList } from "react-window";

const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

interface EventListProperty extends HTMLProps<HTMLDivElement> {
  playVideoAt: (second: number) => void;
  height: number;
}

// 动画配置
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

interface RowProps {
  data: {
    info: SliceInfo[];
    playVideoAt: (second: number) => void;
  };
  index: number;
  style: React.CSSProperties; // 重要：react-window 需要提供定位样式
}

const Row: FC<RowProps> = ({ data, index, style }) => {
  const { info, playVideoAt } = data;
  const item = info[index]; // 获取当前索引的内容
  return (
    <motion.div
      key={item.imgSrc}
      className="w-[95%] mt-2 rounded-lg relative  "
      style={style} // 重要：react-window 提供的定位样式
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <img
        src={item.imgSrc}
        alt=""
        className="w-full rounded-lg"
      />
      <TimeLeftButton second={item.beginSecond} playAt={playVideoAt} />
      <TimeRightButton second={item.endSecond} playAt={playVideoAt} />
    </motion.div>
  );
};

export const EventList: FC<EventListProperty> = ({
  playVideoAt,
  height = 1052,
  style,
  ...rest
}) => {
  const sliceInfoArr = $PR.use((state) => state.sliceInfoArr);
  const outerRef = useRef<HTMLDivElement>(null)
  const getItemSize = () => {
    if (outerRef.current) {
      const outWidth = outerRef.current.getBoundingClientRect().width
      return (outWidth * 0.95 - 8) / 1.78 + 8 //别忘了减掉滚动条宽度
    } else {
      return (height - 55) / 2.5
    }

  };
  const [isRefReady, setIsRefReady] = useState(false);
  useEffect(() => {
    if (outerRef.current) {
      setIsRefReady(true); // 标记 ref 已绑定
    }
  }, [outerRef.current])
  return (
    <div
      className={twMerge(`min-w-[300px] max-w-[360px] mx-4`)}
      style={{ maxHeight: height, ...style }}
      ref={outerRef}
      {...rest}
    >
      <div
        className="p-4 bg-card_background backdrop-blur-[6px]  
        rounded-md border border-solid border-border_card overflow-hidden"
      >
        <div className="text-white flex items-center">
          <TextDiv className="mr-3 bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">
            事件节点
          </TextDiv>
          <DividerIcon className="text-sm h-4 fill-[#47d4ff] relative top-[1px]" />
        </div>
      </div>
      ({isRefReady && <VariableSizeList
        height={height - 55} // 去掉顶部标题部分的高度
        width="95%"
        itemCount={sliceInfoArr.length}
        itemSize={getItemSize} // 返回每个项的高度
        itemData={{ info: sliceInfoArr, playVideoAt }}
        className="custom-scrollbar left-1/2 -translate-x-1/2 "
        style={{ overflowX: "hidden" }} // VariableSizeList会设置为overflow auto，覆盖掉className里的overflow-x
      >
        {Row}
      </VariableSizeList>})
    </div>
  );
};
