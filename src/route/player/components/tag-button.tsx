import { motion } from "framer-motion";
import { FC } from "react"
import styled from "styled-components";
interface TagButtonProperty {
    content: string
}
const TextSpan = styled.span`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  font-size:12px;
  padding : 1px;
`;

export const TagSpan: FC<TagButtonProperty> = ({ content }) => {
    return (
        <motion.span className="bg-[rgba(0,0,0,0.7)]  rounded-lg text-sm p-1 m-1 " >
            <TextSpan className="select-none bg-white hover:bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">
                {content}
            </TextSpan >
        </motion.span >

    )
}
