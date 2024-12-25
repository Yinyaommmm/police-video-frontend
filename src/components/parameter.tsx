import React, { type FC } from "react";
import { Card } from "./card";
import { SettingIcon } from "@/assets/icons";
import { twMerge } from "tailwind-merge";

export interface ParameterCardProps {
  className?: string;
  children?: React.ReactNode;
}

export const ParameterCard: FC<ParameterCardProps> = ({
  children,
  className,
}) => {
  return (
    <Card
      icon={<SettingIcon />}
      title="参数设置"
      className={twMerge(" w-[372px]", className)}
    >
      {children}
    </Card>
  );
};
