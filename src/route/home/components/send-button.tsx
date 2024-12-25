import React, { useEffect, useState, type FC } from "react";
import { api } from "@/api";
import { $Data } from "@/store/data";
import { $Result } from "@/store/result";
import { $UI } from "@/store/ui";
import { twMerge } from "tailwind-merge";
import { EnhanceMethods } from "@/type/common";

export interface SendButtonProps {
  disable: boolean;
  loading: boolean;
}
export const SendButton: FC = () => {
  const loading = $UI.use((state) => state.loading);
  const task = $UI.use((state) => state.task);
  const prompt = $Data.use((state) => state.prompt);
  const [disable, setDisable] = useState<boolean>(true);
  const file = $Data.use((state) => state.file);
  const method = $Data.use((state) => state.method);
  const [tip, setTip] = useState<string>("请输入特征描述");

  useEffect(() => {
    if (prompt === "" && task === "portrait") {
      setDisable(true);
      setTip("请输入特征描述");
      return;
    }
    if (file === undefined) {
      setDisable(true);
      setTip("请上传图片");
      return;
    }
    if (!EnhanceMethods.includes(method) && task === "enhance") {
      setDisable(true);
      setTip("请选择至少一种增强方法");
      return;
    }
    setDisable(false);
    setTip("立即生成");
  }, [prompt, file, task, method]);

  return (
    <button
      className={twMerge(
        "absolute bottom-[68px] h-12 w-[344px] transition-all duration-300 rounded-full px-4 py-[6px] text-lg font-bold border-0 z-20 flex items-center justify-center gap-2 select-none",
        disable || loading
          ? "bg-[#333A45] text-[#727485]"
          : "bg-[linear-gradient(89.86deg,#a7ff1a,#82fac2,#47d4ff)] hover:bg-[linear-gradient(89.86deg,#81d100,#56d69a,#1aaad6)] cursor-pointer",
      )}
      style={{ left: 63 }}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        if (disable || loading) return;
        const data = $Data.get();
        if (
          data.file !== undefined &&
          data.prompt !== "" &&
          !loading &&
          task === "portrait"
        ) {
          try {
            $Result.update("new task", (draft) => {
              draft.results = [];
            });
            $UI.update("new task loading", (draft) => {
              draft.loading = true;
            });
            const res = await api.portrait([data.file], data.prompt);
            $Result.update("set result", (draft) => {
              draft.results = res.results;
            });
            $UI.update("new task finished", (draft) => {
              draft.loading = false;
            });
          } catch (error) {
            console.log(error);
            setDisable(false);
            setTip("重新生成");
          }
        }
        if (
          data.file !== undefined &&
          !loading &&
          task === "enhance" &&
          EnhanceMethods.includes(data.method)
        ) {
          try {
            $Result.update("new task", (draft) => {
              draft.results = [];
            });
            $UI.update("new task loading", (draft) => {
              draft.loading = true;
            });
            const res = await api.enhance([data.file], data.method);
            $Result.update("set result", (draft) => {
              draft.results = res.results;
            });
            $UI.update("new task finished", (draft) => {
              draft.loading = false;
            });
          } catch (error) {
            console.log(error);
            setDisable(false);
            setTip("重新生成");
          }
        }
        if (data.file !== undefined && !loading && task === "aging") {
          try {
            $Result.update("new task", (draft) => {
              draft.results = [];
            });
            $UI.update("new task loading", (draft) => {
              draft.loading = true;
            });
            const res = await api.age(
              [data.file],
              data.age,
              data.gender,
              data.currentAge,
              data.clear,
            );
            $Result.update("set result", (draft) => {
              draft.results = res.results;
            });
            $UI.update("new task finished", (draft) => {
              draft.loading = false;
            });
            $Data.update("set clear signal false", (draft) => {
              draft.clear = 0;
            });
          } catch (error) {
            console.log(error);
            setDisable(false);
            setTip("重新生成");
          }
        }
      }}
    >
      {loading ? "加载中" : tip}
    </button>
  );
};
