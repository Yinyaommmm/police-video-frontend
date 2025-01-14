/* eslint-disable @typescript-eslint/promise-function-async */
import { Axios, type AxiosProgressEvent } from "axios";
import instance from "./axios";
import instance_long from "./axios_long";
import { TimeEvent } from "@/store/player";
import dayjs from "dayjs";
import { LengthSelector } from "@/store/videotransfer";
import { CHUNKSIZE } from "@/config";
import { CompleteStatus } from "@/route/videotransfer/transfer";
interface IThumbnail {
  total_num:number,
  thumbnail_list: {filename:string,url:string,time:number}[]
}
export interface EventsInfoRes{
  total_time : number,
  split:number,
  info:TimeEvent[]
  processed_time:number
}
export type TimeEventsRes = {
    "ScreenShot": string
    "StartTime": number,
    "EndTime": number,
    "Event": string
    "Method": string
}[]

export interface WidthHeightRes{
  width : number
  height : number
}

export type VideoStatusRes = {
  video_name:string,
  completed:CompleteStatus,
  progress:number,
  time_rest:number
}[]

const LengthSelectorKeyMap = new Map<LengthSelector,number|undefined>([['1hour',3600],['2hour',7200],['halfhour',1800],['alllength',undefined]])

export const api = {
  age: (
    files: Array<File | undefined>,
    ageSetting: number,
    gender: string,
    currentAge: number,
    clear: number,
  ): Promise<{ results: string[]; age: number }> => {
    console.log("age", clear);

    const formData = new FormData();
    files.forEach((image) => {
      if (image !== undefined) {
        formData.append(`files`, image, image.name);
      }
    });
    formData.append(`ageSetting`, ageSetting.toString());
    formData.append(`gender`, gender);
    formData.append(`currentAge`, currentAge.toString());
    formData.append(`clear`, clear.toString());
    return instance.post(`/aging/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  enhance: (
    files: Array<File | undefined>,
    method: string,
  ): Promise<{ results: string[]; method: string }> => {
    const formData = new FormData();
    files.forEach((image, index) => {
      if (image !== undefined) {
        formData.append(`files`, image, image.name);
      }
    });
    formData.append(`method`, method);
    return instance.post(`/enhance/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  portrait: (
    files: Array<File | undefined>,
    prompt: string,
  ): Promise<{ results: string[]; prompt: string }> => {
    const formData = new FormData();
    files.forEach((image, index) => {
      if (image !== undefined) {
        formData.append(`files`, image, image.name);
      }
    });
    formData.append(`prompt`, prompt);
    return instance.post(`/portrait/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  login: (
    username: string,
    password: string,
  ): Promise<{ access_token: string; token_type: string }> => {
    return instance.post("/token", {
      username,
      password,
    });
  },
  transfer: {
    upload: async (
      file: File,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    ) => {
      const formData = new FormData();
      formData.append("file", file); 
      formData.append("name", file.name); 
      const response = await instance_long.post("/video/upload", formData, {
        onUploadProgress,
      });
    },
    existCheck: async (fileName: string): Promise<string> => {
      return await instance.get(
        "video/exist",
        {
          params:{
            video_name:fileName
          }
        },
      );
    },
    thumbnailList:async(
      page : number,
      customTime:[null|dayjs.Dayjs,null|dayjs.Dayjs],
      customLength:LengthSelector):Promise<IThumbnail> =>{
      const perPage = 8
      const start_time = customTime[0]
        ? customTime[0].set('hour', 0).set('minute', 0).set('second', 0).format('YYYY-MM-DDTHH:mm:ss')
        : undefined;
      const end_time = customTime[1]
        ? customTime[1].set('hour', 23).set('minute', 59).set('second', 59).format('YYYY-MM-DDTHH:mm:ss')
        : undefined;
      const length = LengthSelectorKeyMap.get(customLength)
      return await instance.get("video/views" ,{
        params:{
          skip:(page-1)*perPage,
          limit:perPage,
          start_time,
          end_time,
          length
        }
      })
   },
    download : async(filename : string,onDownloadProgress:(progressEvent: AxiosProgressEvent) => void):Promise<Blob>=>{
      const res =  await instance_long.get("video/download",{
        params:{
          video_name : filename
        },
        responseType:'blob',
        onDownloadProgress
      })
      return  res.data as Blob;
    },
    statistics : async(filename:string,event_num:number):Promise<EventsInfoRes> =>{
      const res:EventsInfoRes =  await instance.get("video/events_info",{
        params:{
          filename,
          num:event_num
        }
      })
      return res;
    },
    timeEvents : async(filename : string):Promise<TimeEventsRes>=>{
      const res :TimeEventsRes=  await instance.get("video/events",{
        params:{
          filename
        }
      })
      return res
    },
    widthAndHeight : async(filename:string) :Promise<WidthHeightRes> =>{
      const res: WidthHeightRes  = await instance.get("video/height_width",{
        params:{
          video_name:filename
        }
      })
      return res;
    },
    deleteVideo:async(filename:string):Promise<void>=>{
      const res = await instance.delete("video/delete",{
        params:{
          video_name:filename
        }
      })   
    },
    handleStatus : async(page : number,
      customTime:[null|dayjs.Dayjs,null|dayjs.Dayjs],
      customLength:LengthSelector):Promise<VideoStatusRes>=>{
      const perpage = 8
      const start_time = customTime[0]
        ? customTime[0].set('hour', 0).set('minute', 0).set('second', 0).format('YYYY-MM-DDTHH:mm:ss')
        : undefined;
      const end_time = customTime[1]
        ? customTime[1].set('hour', 23).set('minute', 59).set('second', 59).format('YYYY-MM-DDTHH:mm:ss')
        : undefined;
      const length = LengthSelectorKeyMap.get(customLength)
      const res :VideoStatusRes= await instance.get("video/status",{
        params:{
          skip:(page-1)*perpage,
          limit:perpage,
          start_time,
          end_time,
          length
        }
      })
      return res
    },
    addTask:async(fileName:string):Promise<void>=>{
      const res = await instance.post("video/add_task",undefined,{
        params:{
          video_name:fileName
        }
      })
      console.log(res)
    }
   },
  transfer_chunk :{
    createChunk(file:File){
      const totalChunks = Math.ceil(file.size / CHUNKSIZE);
      const chunkArr = []
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNKSIZE;
        const end = Math.min(start + CHUNKSIZE, file.size);
        const chunk = file.slice(start, end);
        chunkArr.push(chunk)
      }
      return chunkArr
    },
    async uploadTotal(file:File, onUploadProgress:(progressEvent: AxiosProgressEvent,curIndex:number,totalNum:number) => void){
      const chunkArr = this.createChunk(file)
      for (let i = 0 ; i < chunkArr.length;i++){
        const iProgress = (axiosProgress: AxiosProgressEvent) =>  {
          onUploadProgress(axiosProgress,i+1,chunkArr.length)
        }
        await this.uploadChunk(file.name,chunkArr.length,i,chunkArr[i],iProgress)
      }
    },
    async uploadChunk(fileName:string,totalNum:number,chunkIndex:number,chunk:Blob,onUploadProgress:(progressEvent: AxiosProgressEvent) => void):Promise<void>{
      const formData = new FormData();
      formData.append('file', chunk, `${fileName}.part${chunkIndex}`); // 确保作为文件对象传递
      formData.append('name', fileName);
      formData.append('total_chunks', totalNum.toString()); // 确保是字符串形式
      formData.append('chunk_index', chunkIndex.toString());   // 确保是字符串形式
      const res = await instance.post('/video/upload_chunk',formData,{onUploadProgress});
    }
  }
};
