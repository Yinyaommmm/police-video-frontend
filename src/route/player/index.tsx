import { type FC } from "react";
import { PlayerNavBar } from "./components/player-navbar";
import { PlayerBody } from "./components/player-body";

export const Player: FC = () => {
  return (
    <div className="flex-grow relative mx-8 max-w-[calc(100vw-200px)]box-border">
      <PlayerNavBar />
      <PlayerBody />
    </div>
  );
};
