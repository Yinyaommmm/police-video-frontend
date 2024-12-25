import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { ParameterCard } from "@/components/parameter";
import { $Data } from "@/store/data";
import { Slider } from "@/components/slider";

export interface PortraitParameterCardProps {
  className?: string;
}

export const PortraitParameterCard: FC<PortraitParameterCardProps> = ({
  className,
}) => {
  const quantity = $Data.use((state) => state.quantity);

  return (
    <ParameterCard className={twMerge(className)}>
      <div className="text-[#999bac] h-[22px] select-none">
        生成数量：<span className="text-white">{quantity} 张</span>
      </div>
      <div className="h-[26px] flex items-center justify-center">
        <Slider
          min={1}
          max={9}
          step={1}
          showStep
          defaultValue={quantity}
          onChange={(value) => {
            $Data.update("set quantity", (draft) => {
              draft.quantity = value;
            });
          }}
        />
      </div>
    </ParameterCard>
  );
};
