import { $VT, type BoardSelector } from "@/store/videotransfer";
import { AnimatePresence, motion } from "framer-motion";
import React, { useId, useRef, type FC } from "react";
import { twMerge } from "tailwind-merge";
import { TransferItem } from "./transfer-item";
import { api } from "@/api";
import { type AxiosProgressEvent } from "axios";
import { calcNeedTime, calcSize, calcSpeed } from "@/utils";
import { v4 as uuidv4 } from "uuid";
import { showMessage } from "./message";

export const TransferBoard: FC = () => {
  const typeItems: Array<{ name: string; key: BoardSelector }> = [
    { name: "全部", key: "all" },
    { name: "上传", key: "up" },
    { name: "下载", key: "down" },
  ];

  const transferArray = $VT.use((state) => state.transferArray);
  const curItem = $VT.use((state) => state.boardSelector);
  const boardVisible = $VT.use((state) => state.boardVisible);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.target.files !== null && e.target.files?.length !== 0) {
      const video = e.target.files[0];
      // 防止重复上传
      const didUpload =
        transferArray.find((item) => item.title === video.name) !== undefined;
      if (didUpload) {
        showMessage("已经上传过该文件");
        return;
      }

      const uniID = uuidv4();
      $VT.update("create new upload", (state) => {
        state.transferArray = [
          ...state.transferArray,
          {
            type: "up",
            speed: "计算中...",
            title: video.name,
            size: calcSize(video.size),
            needTime: "计算中...",
            progress: 0.01,
            uniID,
          },
        ];
      });

      // 布置好上传的回调函数
      await api.transfer.upload(video, (progressEvent: AxiosProgressEvent) => {
        // 上传速度 预期时间
        const progressItem = $VT
          .get()
          .transferArray.find((item) => item.uniID === uniID);
        console.log(transferArray);
        console.log(progressItem);
        if (progressItem === undefined) {
          return;
        }
        $VT.update("upload progress", (state) => {
          const newTransferArray = state.transferArray.filter(
            (item) => item.uniID !== uniID,
          );
          newTransferArray.push({
            ...progressItem,
            speed: calcSpeed(progressEvent.rate),
            needTime: calcNeedTime(progressEvent.estimated),
            progress: progressEvent.progress ?? 0.01,
          });
          state.transferArray = newTransferArray;
        });
      });
      console.log("上传视频完成");
    }
  };
  return (
    <AnimatePresence>
      {boardVisible && (
        <motion.div
          id="transferBorad"
          initial={{ opacity: 0, y: -20 }} // 初始状态：透明且稍微向上偏移
          animate={{ opacity: 1, y: 0 }} // 进入动画：变得不透明并移动到最终位置
          exit={{ opacity: 0, y: -20 }} // 退出动画：再次变为透明并稍微向上移动
          className="absolute w-[28vw] h-80 pt-2 px-2
           bg-black/20 backdrop-blur-md shadow-lg right-2 top-[64px] rounded-lg
           border-solid border-l-0 border-r-0 border-b-0 border-white/20 flex flex-col overflow-y-scroll scrollbar-hidden"
        >
          <div id="manage" className="flex px-4 pb-4">
            {typeItems.map((item) => (
              <div
                key={item.key}
                className={twMerge(
                  "mr-2 min-w-12 font-bold text-sm text-center p-1 cursor-pointer hover:bg-button_hover_background rounded-md",
                  item.key === curItem
                    ? "bg-button_normal_background "
                    : "bg-[#333A45] text-[#727485]",
                )}
                onClick={() => {
                  $VT.update("transfer board type change", (state) => {
                    state.boardSelector = item.key;
                  });
                }}
              >
                {item.name}
              </div>
            ))}
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
            />
            <div
              className="ml-auto font-bold text-md cursor-pointer min-w-32 text-center h-8 leading-8
            bg-button_normal_background hover:bg-button_hover_background rounded-md"
              onClick={() => {
                if (fileInputRef.current !== null) {
                  fileInputRef.current.click();
                }
              }}
            >
              ➕上传新视频
            </div>
          </div>
          {transferArray
            .filter((item) => {
              if (curItem === "all") {
                return true;
              } else {
                return curItem === item.type;
              }
            })
            .map((item) => (
              <TransferItem
                key={item.type + item.title.substring(0, 4)}
                type={item.type}
                title={item.title}
                speed={item.speed}
                size={item.size}
                needTime={item.needTime}
                progress={item.progress}
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
