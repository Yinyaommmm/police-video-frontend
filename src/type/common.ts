export const MenuOptions: Array<{
  text: string;
  value: "portrait" | "aging" | "enhance" | "transfer";
}> = [
  // {
  //   text: "肖像转人脸",
  //   value: "portrait",
  // },
  // {
  //   text: "年龄控制",
  //   value: "aging",
  // },
  // {
  //   text: "人脸增强",
  //   value: "enhance",
  // },
  {
    text: "视频传输",
    value: "transfer",
  },
];

export const EnhanceMethods = ["codeformer", "restoreformer", "vqfr"];

export const Gender = ["男", "女"];
