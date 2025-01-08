import { EventsInfoRes } from "@/api";
import { model } from "@/packages/model";
import { videoOption } from "jol-player";
export interface SliceInfo{
  imgSrc : string
  beginSecond : number 
  endSecond : number
}
export interface TimeEvent {
  start_time: number
  num: number
}
export interface PlayerModel {
  videoName : string
  sliceInfoArr : SliceInfo[],
  jolOption:videoOption,
  statisticalInfo : EventsInfoRes,
  tagInfo : string[]
  playProgressRatio : number
  videoContainer:{
    width:number,
    height:number
  }
}

export const $PR = model<PlayerModel>("PR", {
  videoName : "等待选择视频......",
  sliceInfoArr : [],
  jolOption:{
    videoSrc:""
  },
  statisticalInfo:{
    total_time:0,
    split:0,
    info:[],
    processed_time:0
  },
  tagInfo:[],
  playProgressRatio : 0,
  videoContainer:{
    width: 0,
    height:0
  }
});
