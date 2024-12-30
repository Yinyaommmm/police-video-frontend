
import { $VT } from "@/store/videotransfer";
import React, { type FC } from "react";
import { PlayerNavBar } from "./components/player-navbar";
import { PlayerBody } from "./components/player-body";

export const Player: FC = () => {
  const currentPage = $VT.use((state) => state.curPage);
  const totalPage = $VT.use((state) => state.totalPage);
  return (
    <div className="flex-grow relative mx-8 ">
      <PlayerNavBar />
      <PlayerBody />
    </div>
  );
};
