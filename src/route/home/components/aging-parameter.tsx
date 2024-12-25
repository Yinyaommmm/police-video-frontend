import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { ParameterCard } from "@/components/parameter";
import { Slider } from "@/components/slider";
import { $Data } from "@/store/data";
import { Gender } from "@/type/common";
import { Button } from "@/components/button";

export interface AgingParameterCardProps {
  className?: string;
}

export const AgingParameterCard: FC<AgingParameterCardProps> = ({
  className,
}) => {
  const quantity = $Data.use((state) => state.quantity);
  const age = $Data.use((state) => state.age);
  const currentAge = $Data.use((state) => state.currentAge);
  const gender = $Data.use((state) => state.gender);

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
      <div className="text-[#999bac] h-[22px] mt-2 select-none">
        预测年龄：<span className="text-white">{age} 岁</span>
      </div>
      <div className="h-[26px] flex items-center justify-center">
        <Slider
          min={1}
          max={100}
          step={1}
          defaultValue={age}
          onChange={(value) => {
            $Data.update("set age", (draft) => {
              draft.age = value;
            });
          }}
        />
      </div>
      <div className="text-[#999bac] h-[22px] mt-2 select-none">性别：</div>
      <div className="h-6 flex items-center gap-x-2 mt-3 mb-6">
        {Gender.map((item, index) => (
          <Button
            key={`enhance-parameter-button-${index}`}
            className="text-sm p-4 h-5 w-28 font-normal cursor-pointer"
            disable={gender !== item}
            onClick={() => {
              $Data.update("update gender", (draft) => {
                draft.gender = item;
              });
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="text-[#999bac] h-[22px] mt-2 select-none">
        图片真实年龄：
        <span className="text-white">
          {currentAge === 0 ? "自动预测" : `${currentAge} 岁`}
        </span>
      </div>
      <div className="h-[26px] flex items-center justify-center">
        <Slider
          min={0}
          max={100}
          step={1}
          defaultValue={currentAge}
          onChange={(value) => {
            $Data.update("set currentAge", (draft) => {
              draft.currentAge = value;
            });
          }}
        />
      </div>
    </ParameterCard>
  );
};
