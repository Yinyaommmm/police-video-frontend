import { FoldIcon, UnFoldIcon } from "@/assets/icons";
import { $UI } from "@/store/ui";
import { MenuOptions } from "@/type/common";
import React, { type FC } from "react";

export const NavBar: FC = () => {
  const task = $UI.use((state) => state.task);
  const menu = $UI.use((state) => state.menu);
  return (
    <div className="bg-main_background h-[68px] w-full flex items-center">
      <div
        className="text-icon hover:text-icon_hover px-6 border-0 border-r border-solid border-border_nav h-[26px] flex items-center
        cursor-not-allowed"
        onClick={() => {
          $UI.update("menu trigger", (draft) => {
            // draft.menu = !menu;
          });
        }}
      >
        {menu ? (
          <FoldIcon width="16" height="16" />
        ) : (
          <UnFoldIcon width="16" height="16" />
        )}
      </div>
      <div className="ml-6 text-font_1 text-xl font-medium select-none">
        {MenuOptions.find((item) => item.value === task)?.text}
      </div>
    </div>
  );
};
