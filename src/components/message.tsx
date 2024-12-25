import React, { useEffect, type FC } from "react";
import { $UI } from "@/store/ui";
import { AnimatePresence, motion } from "framer-motion";

export const Message: FC = () => {
  const display = $UI.use((state) => state.messageDisplay);
  const content = $UI.use((state) => state.messageContent);

  useEffect(() => {
    setTimeout(() => {
      $UI.update("close message", (draft) => {
        draft.messageDisplay = false;
      });
    }, 2000);
  }, [display]);

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          className="fixed top-10 left-[50vw] -translate-x-1/2 z-[9999] bg-white rounded-full px-10 py-3 overflow-hidden text-nowrap text-white text-sm"
          style={{
            backgroundImage:
              "linear-gradient(254.03deg, #1b2829bb -4.51%, #171b21bb 46.42%, #191d23bb 91.45%)",
          }}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function showMessage(content: string): void {
  $UI.update("shoe message", (draft) => {
    draft.messageContent = content;
    draft.messageDisplay = true;
  });
}
