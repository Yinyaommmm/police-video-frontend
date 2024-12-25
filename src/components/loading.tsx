import { $UI } from "@/store/ui";
import React, { useEffect, useState, type FC } from "react";
import { Logo } from "./logo";
import { AnimatePresence, motion } from "framer-motion";

export const Loading: FC = () => {
  const loadingCover = $UI.use((state) => state.loadingCover);
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    if (loadingCover) {
      setPercentage(0);
      let timerId: string | number | NodeJS.Timeout | null | undefined = null;

      const startLoading = (): void => {
        let currentPercentage = 0;
        timerId = setInterval(
          () => {
            currentPercentage +=
              (Math.random() * (100 - currentPercentage)) / 3;
            setPercentage(currentPercentage);
            if (currentPercentage >= 99 && timerId !== null) {
              clearInterval(timerId);
              $UI.update("finish fake loading", (draft) => {
                draft.loadingCover = false;
              });
            }
          },
          1000 / Math.max(1, 10 - Math.sqrt(currentPercentage)),
        );
      };
      startLoading();
    }
    if (!loadingCover) setPercentage(100);
  }, [loadingCover]);

  return (
    <AnimatePresence>
      {loadingCover && (
        <motion.div
          className={
            "fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000c] z-40 backdrop-blur-[6px] flex items-center justify-center"
          }
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div>
            <div className="w-full flex items-center justify-center">
              <div className="h-20 w-20">
                <Logo logoAnimationSpeed={0.1} loop />
              </div>
            </div>
            <div className="ml-2 mt-12 rounded-full h-1 w-60 bg-[#727485]"></div>
            <div
              className="ml-2 rounded-full h-1 w-60 bg-[linear-gradient(89.86deg,#a7ff1a,#82fac2,#47d4ff)] -translate-y-1"
              style={{ width: (percentage / 100) * 240 }}
            ></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
