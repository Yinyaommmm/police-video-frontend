import { calcNeedTime } from "@/utils";
import { div } from "framer-motion/client";
import React, { FC } from "react"
import styled from "styled-components";
import { twMerge } from "tailwind-merge";
interface TimeButtonProperty {
    second: number
    playAt: (second: number) => void
}
const TextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  font-size:12px;
  padding : 1px;
`;

export const TimeLeftButton: FC<TimeButtonProperty> = ({ second, playAt }) => {
    return (
        <div className="absolute top-[120px] left-12 bg-[rgba(0,0,0,0.7)] 
        rounded-lg text-sm p-1 cursor-pointer" onClick={() => {
                playAt(second)
            }}>
            <TextDiv className="select-none bg-white hover:bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">
                {calcNeedTime(second)}
            </TextDiv >
        </div >

    )
}
export const TimeRightButton: FC<TimeButtonProperty> = ({ second, playAt }) => {
    return (
        <div className="absolute top-[120px] right-12 bg-[rgba(0,0,0,0.7)] 
        rounded-lg text-sm p-1 cursor-pointer" onClick={() => {
                playAt(second)
            }}>
            <TextDiv className="select-none bg-white hover:bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">
                {calcNeedTime(second)}
            </TextDiv >
        </div >

    )
}