import { DownloadIcon, UploadIcon } from "@/assets/icons";
import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion"; // 引入 motion

export interface TransferItemProps {
  type: "up" | "down";
  title: string;
  size: string;
  speed: string;
  needTime: string;
  progress: number;
}

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};
export const TransferItem: FC<TransferItemProps> = ({
  type,
  title,
  size,
  speed,
  needTime,
  progress,
}) => {
  const dynamicWidth = `${Math.floor(progress * 320)}px`;

  return (
    <motion.div
      className="bg-black/20 backdrop-blur-md shadow-lg
         w-11/12 h-16 rounded-lg flex items-center box-border 
         px-2 mx-auto mb-2 flex-shrink-0"
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {type === "up" ? (
        <UploadIcon className="w-auto h-12 text-1xl text-white" />
      ) : (
        <DownloadIcon className="w-auto h-12 text-1xl text-white" />
      )}

      <div data-type="rightContent" className="w-80 h-14 mx-auto">
        <div className="text-white h-7 w-full leading-7 line-clamp-1" title={title}>
          {title.length < 30 ? title : title.slice(0, 30) + "..."}
        </div>
        <div
          data-type="description"
          className="text-white text-xs h-3 flex justify-between"
        >
          <span>{size}</span>
          <span>{speed}</span>
          <span>{needTime}</span>
        </div>
        <motion.div
          id="progressBar"
          className={`text-white mt-2 h-1 bg-button_normal_background rounded-md`}
          style={{ width: dynamicWidth }}
          initial={{ width: "0px" }} // 进度条的初始宽度为0
          animate={{ width: dynamicWidth }} // 动态宽度
        ></motion.div>
      </div>
    </motion.div>
  );
};
