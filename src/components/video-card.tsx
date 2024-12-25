import React, { type FC } from "react";

export interface VideoCardProps {
  isLast?: boolean;
  imgSrc?: string;
  time?: string;
  title?: string;
}

export const VideoCard: FC<VideoCardProps> = ({
  isLast = false,
  imgSrc = "src/assets/video-default.png",
  time = "04:15:20",
  title = "2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西2024年12月8日南京东路至长江西",
}) => {
  return (
    <div
      id="video-card-1"
      className={`w-[calc(24%)] h-[204px] bg-red-50 rounded-lg relative ${isLast ? "mr-0" : "mr-4"}`}
    >
      <div
        className=" box-border w-full h-6 bg-video_time_background absolute top-0 rounded-lg
           text-white text-sm px-2 py-1 line-clamp-2 leading-[16px] text-right"
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
           text-white text-sm px-2 py-1 line-clamp-2 leading-[21px] "
        title={title}
      >
        {title}
      </div>
    </div>
  );
};
