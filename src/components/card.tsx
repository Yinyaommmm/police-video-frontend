import React, { type ReactNode, type FC } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  icon: ReactNode;
  title: string;
  titleExtra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = (props) => {
  const { icon, title, titleExtra, children, className } = props;
  return (
    <div
      className={twMerge(
        "p-4 bg-card_background backdrop-blur-[6px] rounded-2xl border border-solid border-border_card overflow-hidden",
        className,
      )}
    >
      <div className="h-[26px] mb-4 flex items-center">
        {icon}
        <div className="text-font_1 text-base pl-[6px] font-medium select-none">
          {title}
        </div>
        {titleExtra !== undefined && titleExtra}
      </div>
      {children}
    </div>
  );
};
