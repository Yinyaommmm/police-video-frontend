import { api } from "@/api";
import { $PR } from "@/store/player";
import { $UI } from "@/store/ui";
import { $VT } from "@/store/videotransfer";
import { calcNeedTime, calcSize, calcSpeed } from "@/utils";
import { type FC } from "react";
import { v4 as uuidv4 } from "uuid";
export interface VideoCardProps {
  isLast?: boolean;
  imgSrc?: string;
  time?: string;
  title?: string;
}

export const VideoCard: FC<VideoCardProps> = ({
  isLast = false,
  imgSrc = "src/assets/fortest/video-default.png",
  time = "04:15:20",
  title = "2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西",
}) => {
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
    <div
      id="video-card-1"
      className={`w-[calc(24%)] h-[204px] bg-red-50 rounded-lg relative ${isLast ? "mr-0" : "mr-4"} cursor-pointer`}
      onClick={jumpToWatch}
    >
      <div
        className=" box-border w-full h-6 bg-video_time_background absolute top-0 rounded-lg
           text-white text-sm px-2 py-1 line-clamp-2 leading-[16px] "
      >
        时长：{time}
      </div>
      <img
        src={imgSrc}
        alt="video-default"
        className="w-full h-full rounded-lg"
      />
      <div
        className=" box-border w-full h-12 bg-video_title_background absolute bottom-0 rounded-lg
           text-white text-sm px-2 py-1 line-clamp-2 leading-[21px] break-words "
        title={title}
      >
        {title}
      </div>
    </div >
  );
};
