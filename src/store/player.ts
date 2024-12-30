import { model } from "@/packages/model";
export interface SliceInfo{
  imgSrc : string
  beginSecond : number 
  endSecond : number
}
export interface PlayerModel {
  videoName : string
  videoSrc: string
  sliceInfoArr : SliceInfo[]
}

export const $PR = model<PlayerModel>("PR", {
  videoName : "等待选择视频......",
  videoSrc: "",
  sliceInfoArr : []
});
