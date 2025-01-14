import { api } from "@/api";
import { DeleteIcon, DownloadIcon, UploadIcon } from "@/assets/icons";
import { $PR } from "@/store/player";
import { $UI } from "@/store/ui";
import { $VT } from "@/store/videotransfer";
import { calcNeedTime, calcSize, calcSpeed, createTransferTNURL } from "@/utils";
import derivative from "antd/es/theme/themes/default";
import { motion } from "framer-motion";
import { div } from "framer-motion/client";
import { useState, type FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { RoundProgress } from "./round-progress";
export interface VideoCardProps {
  isLast?: boolean;
  imgSrc?: string;
  time?: string;
  title?: string;
  dealing?: boolean
  progress?: number,
  estimate?: number
}

export const VideoCard: FC<VideoCardProps> = ({
  isLast = false,
  imgSrc = "src/assets/fortest/video-default.png",
  time = "04:15:20",
  title = "2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西",
  dealing = true,
  progress = 0,
  estimate = 3601
}) => {
  const [hover, setHover] = useState(false)
  const downloadVideo = async () => {
    const uniID = uuidv4();
    $VT.update("creae new download", (state) => {
      state.transferArray = [...state.transferArray, {
        type: "down",
        speed: "计算中...",
        title,
        size: "计算中",
        needTime: "计算中...",
        progress: 0.01,
        uniID,
      }]
    })
    const res = await api.transfer.download(title, (progressEvent) => {
      const progressItem = $VT
        .get()
        .transferArray.find((item) => item.uniID === uniID);
      if (progressItem === undefined) {
        return;
      }
      $VT.update("upload progress", (state) => {
        state.transferArray = state.transferArray.map(
          (item) => {
            if (item.uniID === uniID) {
              return {
                ...item,
                ...progressItem,
                speed: calcSpeed(progressEvent.rate),
                needTime: calcNeedTime(progressEvent.estimated),
                progress: progressEvent.progress ?? 0.01,
                size: progressEvent.total ? calcSize(progressEvent.total) : "计算中.."
              }
            }
            else {
              return item
            }
          }
        );
      });
    })
    // 删除上传好的
    $VT.update("delete downloaded video", (state) => {
      state.transferArray = state.transferArray.filter(
        (item) => item.uniID !== uniID,
      );
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(res);
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
  const jumpToWatch = async () => {
    $UI.update('jump to player', (state) => {
      state.task = "player"
    })
    $PR.update('watch video', (state => {
      state.videoName = title
    }))
  }
  return (
    <div className={`box-border select-none w-[calc(24%)] aspect-[1.77] bg-red-50 rounded-lg relative mb-4
     ${isLast ? "mr-0" : "mr-4"} `} >
      <div
        className={`${dealing ? 'opacity-50 pointer-events-none grayscale filter brightness-75 ' : 'cursor-pointer'}
        `}
        onClick={jumpToWatch}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <div
          className=" box-border w-full h-6 bg-video_time_background absolute top-0 rounded-lg
           text-white text-sm px-2 py-1 line-clamp-2 leading-[16px] flex"
        >
          <div>时长：{time}</div>
          {hover && <motion.div
            className="ml-auto mr-4 w-4 text-center bg-black rounded-md scale-150 hover:bg-slate-600"
            initial={{ opacity: 0 }} // 初始透明度为 0
            animate={{ opacity: 1 }} // 鼠标悬停时显示
            transition={{ duration: 0.3 }} // 平滑的动画过渡
            whileHover={{ opacity: 1 }} // 当鼠标悬停在该元素时显示图标
            onClick={async (e) => {
              e.stopPropagation();
              downloadVideo()
            }}
          >
            <DownloadIcon className="text-white align-center" />
          </motion.div>}
          {hover && <motion.div
            className=" w-4 text-center bg-black rounded-md scale-150 hover:bg-slate-600"
            initial={{ opacity: 0 }} // 初始透明度为 0
            animate={{ opacity: 1 }} // 鼠标悬停时显示
            transition={{ duration: 0.3 }} // 平滑的动画过渡
            whileHover={{ opacity: 1 }} // 当鼠标悬停在该元素时显示图标
            onClick={async (e) => {
              e.stopPropagation();
              $VT.update('open modal', (state) => {
                state.showModal = true
                state.modalFileName = title
              })
            }}
          >
            <DeleteIcon className="text-red-500 align-center" />
          </motion.div>}
        </div>

        <img
          src={imgSrc}
          alt="video-default"
          className="  w-full aspect-[1.77] rounded-lg block"
        />
        <div
          className=" box-border w-full h-12 bg-video_title_background absolute bottom-0 rounded-lg
           text-white text-sm px-2 py-1  line-clamp-2 leading-[21px] break-words "
          title={title}
        >
          {title}
        </div>

      </div >
      {/* 圆形进度条 */}
      {dealing === true && <RoundProgress progress={progress} estimate={estimate} />}
    </div >
  );
};
