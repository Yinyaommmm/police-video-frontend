import { motion } from "framer-motion";
import React, { type FC } from "react";

export const Introduction: FC = () => {
  const letters1 =
    "        上海复铼智能科技有限公司致力于成为科学智能（AI for Science）领域的先行者，利用前沿的生成式人工智能技术，解决科学研究中的复杂问题，加速科学发现与实际应用突破。".split(
      "",
    );

  const letters2 =
    "        公司专注于基础显微设备智能化、医疗健康和材料科学，通过AI赋能，驱动生物制药、材料筛选、智慧诊疗、智能安防以及工业制造等多个行业的技术革新与效率提升。".split(
      "",
    );

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,

      transition: { delay: i * 0.02 },
    }),
  };
  return (
    <>
      <div>
        {letters1.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
      <div>
        {letters2.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={(index += letters1.length)}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
    </>
  );
};
