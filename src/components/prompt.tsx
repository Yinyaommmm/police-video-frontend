import React, { useEffect, useRef, useState, type FC } from "react";
import { Card } from "./card";
import { DeleteIcon, PromptIcon } from "@/assets/icons";
import { twMerge } from "tailwind-merge";
import styled from "styled-components";
import { $Data } from "@/store/data";

const StyledTextarea = styled.textarea`
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "PingFang SC",
    "Hiragino Sans GB",
    "noto sans",
    "Microsoft YaHei",
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
  ::-webkit-input-placeholder {
    color: #a8abb2;
  }
  :-ms-input-placeholder {
    color: #a8abb2;
  }
  ::placeholder {
    color: #a8abb2;
    user-select: none;
  }
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

export interface PromptCardProps {
  className?: string;
}

export const PromptCard: FC<PromptCardProps> = ({ className }) => {
  const [focus, setFocus] = useState<boolean>(false);
  const value = $Data.use((state) => state.prompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <>
      <Card
        className={twMerge("min-h-[228px] w-[372px]", className)}
        icon={<PromptIcon />}
        title="肖像特征描述"
      >
        <div
          className={twMerge(
            "min-h-[98px] px-4 py-3 bg-main_background rounded-[10px] border border-solid border-transparent transition-all",
            focus && "border-[#445b5c]",
          )}
          style={{ transitionDuration: "300ms" }}
        >
          <StyledTextarea
            ref={textareaRef}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            className="max-h-60 min-h-[96px] w-[340px] bg-transparent p-0 text-sm leading-6 border-0 text-white"
            value={value}
            onChange={(e) => {
              $Data.update("textarea on change", (draft) => {
                draft.prompt = e.target.value;
              });
            }}
            maxLength={500}
            style={{
              resize: "none",
            }}
            placeholder="请输入肖像的特征内容，以提升生成效果"
          />
          <div className="flex items-center h-[18px]">
            <div className="text-[#4e5062] text-sm leading-[14px] font-light select-none">
              {value.length} / 500
            </div>
            {value.length > 0 && (
              <div className="h-3 border-0 border-l border-solid border-[#4e5062] mx-3" />
            )}
            {value.length > 0 && (
              <div
                className="flex items-center text-icon text-lg hover:text-icon_hover"
                onClick={() => {
                  $Data.update("clear textarea", (draft) => {
                    draft.prompt = "";
                  });
                }}
              >
                <DeleteIcon />
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
