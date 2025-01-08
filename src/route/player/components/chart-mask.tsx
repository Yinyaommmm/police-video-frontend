import { $PR } from "@/store/player"
import { motion } from "framer-motion"
import { FC } from "react"



export const ChartMask: FC = () => {
    const ratio = $PR.use(state => state.playProgressRatio)
    const ratioPercent = `${(ratio * 100).toFixed(2)}%`
    return (<motion.div className=" absolute top-0 left-0 h-full bg-[#47d4ff] opacity-15 pointer-events-none"
        style={{ width: ratioPercent }}
        initial={{ width: "0%" }} // 进度条的初始宽度为0
        animate={{ width: ratioPercent }} // 动态宽度
        transition={{ type: false }}
    ></motion.div >)
}