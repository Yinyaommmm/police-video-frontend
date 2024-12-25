import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type FC,
} from "react";
import { AddIcon, DeleteIcon, ImageIcon, UploadIcon } from "@/assets/icons";
import { Card } from "./card";
import { Slider } from "./slider";
import { twMerge } from "tailwind-merge";
import { $Data } from "@/store/data";

export interface ImageUploadProps {
  className?: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({ className }) => {
  // const [file, setFile] = useState<File | undefined>(undefined);
  const file = $Data.use((state) => state.file);
  const setFile = (file: File | undefined): void => {
    $Data.update("upload image", (draft) => {
      draft.file = file;
      draft.clear = 1;
    });
  };
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number>(0);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (
          reader.readyState === FileReader.DONE &&
          reader.result !== null &&
          typeof reader.result === "string"
        ) {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(undefined);
    }
  }, [file]);

  return (
    <Card
      icon={<ImageIcon />}
      title="参考图 / 垫图"
      className={twMerge("min-h-[162px] w-[372px]", className)}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <div className="h-[120px]">
        {previewUrl === undefined && (
          <div
            className="flex flex-col items-center justify-center h-[120px] w-[120px] rounded-xl bg-main_background overflow-hidden text-[#727485] hover:text-[#cccccc]"
            onClick={() => {
              if (inputRef.current !== null) {
                inputRef.current.click();
              }
            }}
          >
            <AddIcon className="text-xl mb-2" />
            <div className="text-xs select-none">JPG / PNG</div>
          </div>
        )}
        {previewUrl !== undefined && (
          <div className="h-[120px] flex">
            <div
              className="h-[120px] w-[120px] bg-cover bg-center bg-no-repeat rounded-l-xl"
              style={{ backgroundImage: `url(${previewUrl})` }}
            >
              <div className="flex items-center justify-center gap-4 relative top-0 left-0 h-full w-full backdrop-blur-[5px] rounded-l-xl opacity-0 hover:opacity-100 bg-[#0008] transition-opacity duration-200">
                <DeleteIcon
                  className="text-xl text-icon hover:text-icon_hover"
                  onClick={() => {
                    if (inputRef.current !== null) inputRef.current.value = "";
                    setFile(undefined);
                  }}
                />
                <UploadIcon
                  className="text-xl text-icon hover:text-icon_hover"
                  onClick={() => {
                    if (inputRef.current !== null) {
                      inputRef.current.click();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex-grow rounded-r-xl p-[18px] bg-[linear-gradient(264deg,#22403eb3_2.09%,#283d46b3_94.63%)] text-xs">
              <div className="text-white text-sm leading-6 h-[25px] flex items-center mb-3">
                参考强度
              </div>
              <div className="flex items-center justify-between h-6 text-[#999bac]">
                <div className={twMerge(value < 20 && "text-white")}>弱</div>
                <div
                  className={twMerge(value >= 20 && value < 40 && "text-white")}
                >
                  较弱
                </div>
                <div
                  className={twMerge(value >= 40 && value < 60 && "text-white")}
                >
                  中
                </div>
                <div
                  className={twMerge(value >= 60 && value < 80 && "text-white")}
                >
                  较强
                </div>
                <div className={twMerge(value >= 80 && "text-white")}>强</div>
              </div>
              <div className="flex items-center h-8">
                <Slider
                  min={0}
                  max={100}
                  defaultValue={80}
                  step={1}
                  onChange={(v) => {
                    setValue(v);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
