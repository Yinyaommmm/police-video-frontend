import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { NoticeIcon } from "@/assets/icons";
import { Card } from "@/components/card";

export interface AgingNoticeCardProps {
  className?: string;
}

export const AgingNoticeCard: FC<AgingNoticeCardProps> = ({ className }) => {
  return (
    <Card
      icon={<NoticeIcon className="text-white" />}
      title="注意"
      className={twMerge(" w-[372px]", className)}
    >
      <div className="text-white pb-2 font-light">
        切换图像时需要进行预处理，请耐心等待。
      </div>
      <div className="text-white font-light">
        对于 <span className="font-bold">同一张图片 </span>
        的不同年龄段预测则无需预处理等待。
      </div>
    </Card>
  );
};
