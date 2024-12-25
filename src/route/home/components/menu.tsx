import React, { useEffect, type FC } from "react";
import { $UI } from "@/store/ui";
import { MenuOptions } from "@/type/common";
import styled from "styled-components";
import { twMerge } from "tailwind-merge";
import { useAnimate } from "framer-motion";

const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
`;

export const Menu: FC = () => {
  const menu = $UI.use((state) => state.menu);
  const task = $UI.use((state) => state.task);
  const [scope, animate] = useAnimate();

  const anime = async (): Promise<void> => {
    await animate(
      scope.current,
      {
        width: menu ? "176px" : "0px",
        paddingLeft: menu ? "8px" : "0px",
        paddingRight: menu ? "8px" : "0px",
        opacity: menu ? 100 : 0,
      },
      { type: "tween", duration: 0.2 },
    );
  };
  useEffect(() => {
    void anime();
  }, [menu]);

  return (
    <div ref={scope} className={twMerge("h-full bg-main_background px-2")}>
      {MenuOptions.map((item) => (
        <div
          key={`menu-${item.value}`}
          className={twMerge(
            "flex items-center pl-4 mb-2 overflow-hidden text-nowrap hover:bg-[#24282c] transition-color duration-200 h-12 rounded-full text-base transition-all",
            task === item.value && "bg-[#191d21]",
            menu ? "w-40" : "w-0 pointer-events-none",
          )}
          onClick={() => {
            $UI.update("menu change", (draft) => {
              draft.task = item.value;
            });
          }}
        >
          <TextDiv
            className={twMerge(
              "select-none",
              task === item.value
                ? "bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]"
                : "bg-white",
            )}
          >
            {item.text}
          </TextDiv>
        </div>
      ))}
    </div>
  );
};
