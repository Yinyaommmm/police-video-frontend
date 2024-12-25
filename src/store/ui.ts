import { model } from "@/packages/model";

export interface UIModel {
  task: "aging" | "portrait" | "enhance" | "transfer";
  menu: boolean;
  loading: boolean;
  loadingCover: boolean;
  login: boolean;
  messageContent: string;
  messageDisplay: boolean;
}

export const $UI = model<UIModel>("UI", {
  task: "transfer",
  menu: true,
  loading: false,
  loadingCover: false,
  login: false,
  messageContent: "",
  messageDisplay: false,
});
