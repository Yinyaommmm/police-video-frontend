import { calcNeedTime } from "@/utils";
import { motion } from "framer-motion";
import { FC } from "react";

interface RoundProgressProps {
    progress: number;
    estimate: number
}

export const RoundProgress: FC<RoundProgressProps> = ({ progress, estimate = 3600 }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius; // 正确的周长计算
    const strokeOffset = circumference - (progress * circumference);
    return (
        <div className="w-40 h-40 absolute left-1/2 top-[47%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
                <div className="text-center text-xl">{(progress * 100).toFixed(1)}%</div>
                <div className="text-center text-xs">{progress === 0 ? "排队中..." : `预计仍需${calcNeedTime(estimate)}`}</div>
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