import { motion } from "framer-motion";
import React, { type FC } from "react";

export interface LogoProps {
  logoAnimationSpeed?: number;
  loop?: boolean;
}

export const Logo: FC<LogoProps> = ({
  logoAnimationSpeed = 0.3,
  loop = false,
}) => {
  const scale = 10;
  const loopTransition = {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.5,
  };

  const pointsA: Array<{ x: number; y: number }> = [
    { x: 7.879, y: 13.021 },
    { x: 3.879, y: 10.893 },
    { x: 3.879, y: 6.894 },
    { x: 15.708, y: 0.851 },
    { x: 15.708, y: 5.021 },
    { x: 7.964, y: 8.851 },
  ];

  const pointsB: Array<{ x: number; y: number }> = [
    { x: 8.049, y: 13.021 },
    { x: 15.846, y: 9.039 },
    { x: 15.846, y: 13.209 },
    { x: 12.134, y: 14.979 },
    { x: 12.049, y: 19.149 },
    { x: 8.049, y: 17.021 },
  ];

  const shapeA = {
    hidden: {
      pathLength: 0,
      fill: "#2d499e0",
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      fill: "#2d499e",
      opacity: 1,
      transition: {
        fill: loop
          ? {
              ...loopTransition,
              ease: [0.75, 0.01, 0.25, 0.99],
              duration: logoAnimationSpeed * 10,
            }
          : {
              ease: [0.75, 0.01, 0.25, 0.99],
              duration: logoAnimationSpeed * 10,
            },
        pathLength: loop
          ? {
              ...loopTransition,
              ease: [0.42, 0, 0.58, 1],
              duration: logoAnimationSpeed * 10,
            }
          : {
              ease: [0.42, 0, 0.58, 1],
              duration: logoAnimationSpeed * 10,
            },
        opacity: { duration: 0.01 },
      },
    },
  };

  const shapeB = {
    hidden: {
      pathLength: 0,
      fill: "#DE38350",
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      fill: "#DE3835",
      opacity: 1,

      transition: {
        fill: loop
          ? {
              ...loopTransition,
              ease: [0.75, 0.01, 0.25, 0.99],
              duration: logoAnimationSpeed * 10,
            }
          : {
              ease: [0.75, 0.01, 0.25, 0.99],
              duration: logoAnimationSpeed * 10,
            },
        pathLength: loop
          ? {
              ...loopTransition,
              ease: [0.42, 0, 0.58, 1],
              duration: logoAnimationSpeed * 10,
            }
          : {
              ease: [0.42, 0, 0.58, 1],
              duration: logoAnimationSpeed * 10,
            },
      },
    },
  };
  return (
    <>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d={
            pointsA
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${point.x * scale},${point.y * scale}`,
              )
              .join(" ") + " Z"
          }
          stroke="#2D4A9E"
          variants={shapeA}
          strokeWidth={5}
          strokeLinecap={"round"}
        />
        <motion.path
          d={
            pointsB
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${point.x * scale},${point.y * scale}`,
              )
              .join(" ") + " Z"
          }
          stroke="#DE3835"
          variants={shapeB}
          transition={{ repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
          strokeWidth={5}
          strokeLinecap={"round"}
        />
      </motion.svg>
    </>
  );
};
