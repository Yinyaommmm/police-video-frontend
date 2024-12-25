import React, { useEffect, useState, type FC } from "react";
import styled from "styled-components";
import { twMerge } from "tailwind-merge";
import { Logo } from "./logo";
import { motion } from "framer-motion";
import { Introduction } from "./introduction";
import { $UI } from "@/store/ui";
import { api } from "@/api";
import instance from "@/api/axios";

const ColoredTextDiv = styled.div`
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
`;

const logoAnimationSpeed = 0.3;

export const Login: FC = () => {
  const [inputUsername, setInputUsername] =
    useState<string>("default-username");
  const [inputPassword, setInputPassword] =
    useState<string>("default-password");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [hover, setHover] = useState<boolean>(false);
  const login = $UI.use((state) => state.login);

  useEffect(() => {
    setDisabled(inputUsername.length < 6 || inputPassword.length < 6);
  }, [inputUsername, inputPassword]);

  return (
    <div
      className={
        "fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000c] z-40 backdrop-blur-[6px] flex items-center justify-center"
      }
      style={{ display: login ? "none" : "" }}
    >
      <div
        className="flex h-[435px] w-[720px] rounded-xl border border-solid border-[#1e3139]"
        style={{
          backgroundImage:
            "linear-gradient(252.37deg,#1b262b .55%,#171b21,#191d23 90.08%),linear-gradient(68.56deg,#1e2930 29.44%,#1d1d1d 59.6%,#262a2f 82.91%,#2e4141 101.21%)",
        }}
      >
        <div className="relative h-full w-[279px] bg-[#0e1116] rounded-l-xl">
          <div
            className="absolute top-0 left-0 h-full w-full rounded-l-xl"
            style={{ backgroundImage: "url(background.jpg)" }}
          />
          <div className="absolute top-0 left-0 h-full w-full bg-[#00000074] backdrop-blur-sm rounded-l-xl" />
          <div className="relative w-full flex items-center justify-center mt-7 z-50">
            <div className="h-12 w-12">
              <Logo logoAnimationSpeed={logoAnimationSpeed} />
            </div>
            <motion.div
              className="flex items-center justify-center overflow-hidden flex-nowrap"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{
                delay: logoAnimationSpeed * 4,
                ease: [0.75, 0.01, 0.25, 0.99],
                duration: logoAnimationSpeed * 6,
              }}
            >
              <div className="text-[#2D4A9E] text-2xl mr-3 shrink-0 tracking-widest">
                复铼智能
              </div>
              <div className="h-9 w-[2px] bg-[#DE3835] rounded-full mr-3 shrink-0"></div>
              <div className="text-[#2D4A9E] text-2xl mr-4 shrink-0">
                FLY AI
              </div>
            </motion.div>
          </div>
          <div className="text-white px-8 pt-4 relative z-50 text-sm leading-6">
            <Introduction />
          </div>
        </div>
        <div className="h-[399px] w-[386px] pt-9 pr-6 pl-[31px]">
          <div className="h-8 text-white text-[22px] leading-8 font-medium mb-1">
            欢迎登录
          </div>
          <div className="text-sm text-[#727485] mb-6 h-[23px]">
            请登录后使用本系统
          </div>
          <div className="text-base h-8">
            <ColoredTextDiv className="bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)]">
              密码登录
            </ColoredTextDiv>
            <div className="mt-1 h-[2px] bg-[linear-gradient(135deg,#52ffba_9.27%,#23faec_46.96%,#0af_88.5%)] w-16" />
          </div>
          <div className="mt-5">
            <input
              type="text"
              className="mb-5 bg-main_background rounded-xl px-4 py-3 border border-transparent border-solid text-white w-[350px] h-4 focus:border-[#445b5c] transition-colors focus:outline-none"
              placeholder="请输入用户名"
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
              value={inputUsername}
            />
            <input
              type="password"
              className="mb-6 bg-main_background rounded-xl px-4 py-3 border border-transparent border-solid text-white w-[350px] h-4 focus:border-[#445b5c] transition-colors focus:outline-none"
              placeholder="请输入密码"
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
              value={inputPassword}
            />
            <div className="mb-10 text-[#727485] text-sm">
              登录即代表同意《用户协议》
            </div>
            <button
              className={twMerge(
                "w-full px-7 h-12 rounded-full border-0 text-[#0b0c1a] text-sm font-medium transition-all",
                disabled &&
                  "pointer-events-none cursor-not-allowed bg-[#333a45] text-[#727485]",
              )}
              style={{
                backgroundImage: disabled
                  ? ""
                  : hover
                    ? "linear-gradient(89.86deg,#81d100,#56d69a,#1aaad6)"
                    : "linear-gradient(89.86deg,#a7ff1a,#82fac2,#47d4ff)",
              }}
              disabled={disabled}
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                const res = await api.login(inputUsername, inputPassword);
                if (
                  res.access_token !== null &&
                  res.access_token !== undefined
                ) {
                  localStorage.setItem("token", res.access_token);
                  instance.defaults.headers.common.Authorization = `Bearer ${res.access_token}`;
                  $UI.update("login", (draft) => {
                    draft.login = true;
                    draft.loadingCover = true;
                    draft.messageContent = "登录成功，加载中";
                    draft.messageDisplay = true;
                  });
                }
              }}
            >
              立即登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
