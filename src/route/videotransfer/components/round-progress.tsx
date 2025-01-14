import { calcNeedTime } from "@/utils";
import { motion } from "framer-motion";
import { FC } from "react";
import { CompleteStatus } from "../transfer";
import { span } from "framer-motion/client";

interface RoundProgressProps {
    progress: number;
    estimate: number
    complete: CompleteStatus
}
function makeWaitingMsg(complete: CompleteStatus, estimate: number) {
    if (complete === CompleteStatus.AWaitHandling) {
        return <span> 排队中...</span>
    } else if (complete === CompleteStatus.Handling) {
        return <span> {`预计仍需${calcNeedTime(estimate)}`}</span>
    } else if (complete === CompleteStatus.ErrorHandled) {
        return <span className="text-red-500">异常视频</span>
    }
}

export const RoundProgress: FC<RoundProgressProps> = ({ progress, estimate = 3600, complete }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius; // 正确的周长计算
    const strokeOffset = circumference - (progress * circumference);
    let msg = makeWaitingMsg(complete, estimate)
    return (
        <div className="w-40 h-40 absolute left-1/2 top-[47%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
                <div className="text-center text-xl">{(progress * 100).toFixed(1)}%</div>
                <div className="text-center text-xs">
                    {msg}
                </div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                <defs>
                    <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#a7ff1a" />
                        <stop offset="50%" stopColor="#82fac2" />
                        <stop offset="100%" stopColor="#47d4ff" />
                    </linearGradient>
                </defs>
                {/* 背景圆 */}
                <circle cx="12" cy="12" r={radius} stroke="#e0e0e0" strokeWidth="1.2" />
                {/* 进度圆 */}
                <motion.circle
                    cx="12"
                    cy="12"
                    r={radius}
                    stroke="url(#Gradient2)"
                    strokeWidth="1.2"
                    strokeDashoffset={strokeOffset}
                    style={{
                        strokeDasharray: `${circumference} ${circumference}`,
                        rotate: -90,
                        strokeLinecap: "round"
                    }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeOffset }}
                />
            </svg>
        </div>
    );
};