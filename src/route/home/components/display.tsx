import React, { useEffect, useMemo, useRef, useState, type FC } from "react";
import { DefaultImage } from "@/assets/image";
import { $Result } from "@/store/result";
import { $UI } from "@/store/ui";
import { CompareIcon, DownloadIcon } from "@/assets/icons";
import { $Data } from "@/store/data";

export const Display: FC = () => {
  const results = $Result.use((state) => state.results);
  const loading = $UI.use((state) => state.loading);
  const origin = $Data.use((state) => state.file);
  const [compareHolding, setCompareHolding] = useState<boolean>(false);
  const imageUrl = useMemo(() => {
    if (origin !== undefined) return URL.createObjectURL(origin);
    else return "";
  }, [origin]);
  const imgRef = useRef<HTMLImageElement>(null);
  const [width, setWidth] = useState<number | string>("auto");
  const [height, setHeight] = useState<number | string>("auto");
  const [opacity, setOpacity] = useState<number>(0);

  const handleDownload = (): void => {
    if (loading || results[0] === undefined) return;
    const element = document.createElement("a");
    element.style.display = "none";
    element.href = `data:image/jpeg;base64,${results[0]}`;
    element.download = "image.jpg";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center pb-[118px]">
          <DefaultImage />
          <div className="text-[#c5c7d5] text-center text-lg select-none">
            请在左侧输入 <span className="text-[#a7ff1a]">图片</span> 与
            <span className="text-[#47d4ff]"> 提示词</span>
          </div>
        </div>
      )}
      {!loading && results[0] !== undefined && (
        <div
          className="relative flex flex-col items-center justify-center pb-[118px]"
          onMouseEnter={() => {
            setOpacity(100);
          }}
          onMouseLeave={() => {
            setOpacity(0);
          }}
        >
          {!compareHolding && (
            <img
              ref={imgRef}
              className="max-h-[591px] max-w-[591px] rounded-xl object-contain"
              src={`data:image/jpeg;base64,${results[0]}`}
              onLoad={() => {
                if (results[0] !== undefined && imgRef.current !== null) {
                  setWidth(imgRef.current.width);
                  setHeight(imgRef.current.height);
                }
              }}
            />
          )}
          {compareHolding && (
            <img
              className="max-h-[591px] max-w-[591px] rounded-xl object-contain"
              src={imageUrl}
              style={{ width, height }}
            />
          )}
          <div
            className="absolute right-0 top-0 rounded-[10px] backdrop-blur-[6px] py-[6px] px-3 bg-[#0007] mt-4 mr-4 text-xl flex items-center justify-center text-white transition-opacity"
            style={{
              opacity,
            }}
          >
            <CompareIcon
              className="hover:text-[#9ffd38] cursor-pointer"
              onMouseDown={() => {
                setCompareHolding(true);
              }}
              onMouseUp={() => {
                setCompareHolding(false);
              }}
            />
            <div className="mx-2 border border-solid border-[#999bac] h-2" />
            <DownloadIcon
              className="hover:text-[#9ffd38] cursor-pointer"
              onClick={() => {
                handleDownload();
              }}
            />
          </div>
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center justify-center pb-[118px]">
          <DefaultImage />
          <div className="text-[#c5c7d5] text-center text-lg flex items-center justify-center gap-4">
            正在加载中
          </div>
        </div>
      )}
    </div>
  );
};
