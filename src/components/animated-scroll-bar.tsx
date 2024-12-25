import React, { type ReactNode, type FC } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { $UI } from "@/store/ui";

const DivWithoutScrollBar = styled.div`
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

export interface AnimatedScrollDivProps {
  children?: ReactNode;
  excludedChildren?: ReactNode;
}

export const AnimatedScrollDiv: FC<AnimatedScrollDivProps> = ({
  children,
  excludedChildren,
}) => {
  const task = $UI.use((state) => state.task);
  return (
    <DivWithoutScrollBar className="relative h-full w-[406px] overflow-scroll pr-4">
      <AnimatePresence mode="wait">
        <motion.div
          className="relative"
          key={`AnimatedScrollDiv-${task}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {excludedChildren}
    </DivWithoutScrollBar>
  );
};
