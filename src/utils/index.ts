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

export function calcSpeed(rate: number | undefined): string {
  if (rate !== undefined) {
    const size = calcSize(rate);
    return `${size}/秒`;
  }
  return "计算中...";
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
