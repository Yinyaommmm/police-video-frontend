import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { ParameterCard } from "@/components/parameter";
import { $Data } from "@/store/data";
import { Button } from "@/components/button";
import { Slider } from "@/components/slider";
import { EnhanceMethods } from "@/type/common";

export interface EnhanceParameterCardProps {
  className?: string;
}

export const EnhanceParameterCard: FC<EnhanceParameterCardProps> = ({
  className,
}) => {
  const selectedMethod = $Data.use((state) => state.method);
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
      <div className="text-[#999bac] h-[22px] mt-2 select-none">增强方法：</div>
      <div className="h-6 flex items-center gap-x-2 mt-3 mb-2">
        {EnhanceMethods.map((item, index) => (
          <Button
            key={`enhance-parameter-button-${index}`}
            className="text-sm p-4 h-5 w-28 font-normal cursor-pointer"
            disable={selectedMethod !== item}
            onClick={() => {
              $Data.update("update methods", (draft) => {
                draft.method = item;
              });
            }}
          >
            {item}
          </Button>
        ))}
      </div>
    </ParameterCard>
  );
};
