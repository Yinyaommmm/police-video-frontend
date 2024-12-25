import React, { type ReactNode, type FC, type MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps {
  disable?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  loading = false,
  disable = false,
  onClick,
}) => {
  return (
    <button
      className={twMerge(
        "h-12 w-[344px] transition-all duration-300 rounded-full px-4 py-[6px] text-lg font-bold border-0 z-20 flex items-center justify-center gap-2",
        disable || loading
          ? "bg-[#333A45] text-[#727485]"
          : "bg-[linear-gradient(89.86deg,#a7ff1a,#82fac2,#47d4ff)] hover:bg-[linear-gradient(89.86deg,#81d100,#56d69a,#1aaad6)] cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
