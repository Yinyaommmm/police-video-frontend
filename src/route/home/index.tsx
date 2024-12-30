import React, { useEffect, type FC } from "react";
import { NavBar } from "@/components/nav-bar";
import { Menu } from "./components/menu";
import { Loading } from "@/components/loading";
import { $UI } from "@/store/ui";
import { Message } from "@/components/message";
import { Transfer } from "./components/transfer";
import { Player } from "@/route/player/index";

export const Home: FC = () => {
  const task = $UI.use((state) => state.task);
  useEffect(() => {
    if (localStorage.getItem("token") === "") {
      $UI.update("un login", (draft) => {
        draft.login = false;
        draft.messageContent = "登录状态失效，请重新登录";
        draft.messageDisplay = true;
      });
    }
  }, []);

  return (
    <div className="max-w-[100vw] min-h-[100vh]">
      {/* <Login /> */}
      <Loading />
      <Message />
      <NavBar />
      <div className="flex h-[calc(100vh-68px)] bg-main_background">
        <Menu />
        {task === "transfer" && <Transfer />}
        {task === "player" && <Player />}
      </div>
      <div
        className="fixed bottom-0 left-0 w-[100vw] h-[118px] 
      bg-[linear-gradient(0deg,#0d1116_40%,#0d111600)] pointer-events-none z-10"
      />
    </div>
  );
};
