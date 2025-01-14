import { CHUNKSIZE } from "@/config";

const GBLevel = 1024 * 1024 * 1024;
const MBLevel = 1024 * 1024;
const KBLevel = 1024;

export function calcSize(size: number): string {
  if (size >= GBLevel) {
    return `${(size / GBLevel).toFixed(2)} GB`; // 转换为GB并保留两位小数
  } else if (size >= MBLevel) {
    return `${(size / MBLevel).toFixed(2)} MB`; // 转换为MB并保留两位小数
  } else if (size >= KBLevel) {
    return `${(size / KBLevel).toFixed(2)} KB`; // 转换为KB并保留两位小数
  } else {
    return `${size} B`; // 直接显示字节数
  }
}
function calcSizeRand(size:number):string{
  const randVal = 1 + 0.08 * (Math.random()-0.5)
  if (size >= GBLevel) {
    return `${(size / GBLevel*randVal).toFixed(2)} GB`; // 转换为GB并保留两位小数
  } else if (size >= MBLevel) {
    return `${(size / MBLevel*randVal).toFixed(2)} MB`; // 转换为MB并保留两位小数
  } else if (size >= KBLevel) {
    return `${(size / KBLevel*randVal).toFixed(2)} KB`; // 转换为KB并保留两位小数
  } else {
    return `${size*randVal} B`; // 直接显示字节数
  }
}


export function calcSpeed(rate: number | undefined): string {
  if (rate !== undefined) {
    const size = calcSizeRand(rate);
    const speed = `${size}/秒`
    return speed;
  }
  return `计算中...`;
}
export function calcSpeedFactory(){
  const startTime =  Date.now()
  let lastEnd = Date.now()
  let lastIdx = 1
  return function(bytes:number , curIndex:number ,totalNum:number){
    // 切换了curIndex，所以可以计算新的平均时间了
    if (curIndex !== lastIdx){
      lastEnd = Date.now()
    }
    if (lastEnd !== startTime){
    const avgChunkSpeed = ( (curIndex-1) * CHUNKSIZE + bytes) / (lastEnd - startTime) *1000
    return calcSpeed(avgChunkSpeed);}else{
      return "计算中..."
    }
  }
}

export function calcNeedTime(estimated: number | undefined): string {
  if (estimated !== undefined) {
    const hours = Math.floor(estimated / 3600);
    const minutes = Math.floor((estimated % 3600) / 60);
    const seconds = Math.floor(estimated % 60);
    const timeArr = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
    const timeString = timeArr
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
    return timeString;
  }
  return "计算中...";
}

export function calcNeetTimeFactory(){
  const startTime =  Date.now()
  let lastEnd = Date.now()
  let lastIdx = 1
  return function(estimated:number | undefined, curIndex:number ,totalNum:number){
    // 切换了curIndex，所以可以计算新的平均时间了
    if (curIndex !== lastIdx){
      lastEnd = Date.now()
    }
    const avgChunkTime = (lastEnd - startTime) / Math.max(1,curIndex-1)  / 1000
    if (estimated !== undefined) {
      const remainTotalTime = avgChunkTime*(totalNum-curIndex) + estimated
      return calcNeedTime(remainTotalTime);
    }
    return calcNeedTime(avgChunkTime*(totalNum-curIndex + 1));
  }
}

export function createTransferTNURL(fileName:string):string{
  return `api/v1/video/image?filename=${fileName}`
}
export function createEventsTNURL(fileName:string):string{
  return `api/v1/video/ScreenShot?filename=${fileName}`
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: Parameters<T>): void {
    if (timeout !== null) {clearTimeout(timeout); console.log('debounce')}
    timeout = setTimeout(() => {func(...args)}, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    if (now - lastTime > wait) {
      func(...args);  // 直接调用 func，不需要 apply 和 this
      lastTime = now;
    }
  };
}
