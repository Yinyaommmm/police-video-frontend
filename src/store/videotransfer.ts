import { model } from "@/packages/model";
import dayjs from 'dayjs';
export type TimeSelector = "alldays" | "custom-time-choose";
export type LengthSelector = "alllength" | "halfhour" | "1hour" | "2hour";
export type BoardSelector = "all" | "up" | "down";
export interface ITransferItem {
  type: "up" | "down";
  title: string;
  size: string;
  speed: string;
  needTime: string;
  progress: number;
  uniID: string;
}
export interface IVideoCardItem {
  image : string,
  name : string,
  time : string
}

export interface VideoTransferModel {
  timeSelector: TimeSelector;
  customTime : [null | dayjs.Dayjs,null | dayjs.Dayjs];
  lengthSelector: LengthSelector;
  curPage: number;
  totalPage: number;
  perPage:number,
  boardVisible: boolean;
  boardSelector: BoardSelector;
  transferArray: ITransferItem[];
  videoCardArray : IVideoCardItem[]
}

export const $VT = model<VideoTransferModel>("UI", {
  timeSelector: "alldays",
  customTime : [null,null],
  lengthSelector: "alllength",
  curPage: 1,
  totalPage: 5,
  perPage:8,
  boardVisible: false,
  boardSelector: "all",
  transferArray: [
    // {
    //   type: "up",
    //   title: "五角场合生汇顶楼监控360°江湾体育场方向",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.4,
    //   uniID: "AA1",
    // },
    // {
    //   type: "down",
    //   title: "五角场合生汇顶楼监控360°复旦邯郸校区方向",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.7,
    //   uniID: "AA2",
    // },
    // {
    //   type: "up",
    //   title: "四角场合生汇顶级监控无死角360°想看就看无人能管",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.4,
    //   uniID: "AA3",
    // },
    // {
    //   type: "down",
    //   title: "四角场合生汇顶级监控无死角360°想看就看无人能管",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.7,
    //   uniID: "AA4",
    // },
    // {
    //   type: "up",
    //   title: "三角场合生汇顶级监控无死角360°想看就看无人能管",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.4,
    //   uniID: "AA5",
    // },
    // {
    //   type: "down",
    //   title: "三角场合生汇顶级监控无死角360°想看就看无人能管",
    //   speed: "200KB/S",
    //   size: "3.2GB",
    //   needTime: "12:40",
    //   progress: 0.7,
    //   uniID: "AA6",
    // },
  ],
  videoCardArray:[]
});
