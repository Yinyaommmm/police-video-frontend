import { DatePicker, ConfigProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/locale/zh_CN';
const { RangePicker } = DatePicker;
import 'dayjs/locale/zh-cn';
import { $VT } from '@/store/videotransfer';
import dayjs from 'dayjs';
export const RangeTimePicker: React.FC = () => {
    const curItem = $VT.use((state) => state.timeSelector);
    const customTime = $VT.use(state => state.customTime)
    const disabledDate = (current: dayjs.Dayjs | null): boolean => {
        const today = dayjs()
        return current !== null && current > today
    };
    ;
    return (
        <ConfigProvider locale={zhCN}>
            <RangePicker variant='borderless'
                value={customTime}
                onChange={(times) => {
                    $VT.update('change custom time', (state) => {
                        if (times) {
                            state.customTime = times
                        } else {
                            state.customTime = [null, null]
                        }
                    })
                }}
                onFocus={() => {
                    $VT.update('foucs custom time', (state) => {
                        state.timeSelector = "custom-time-choose"
                    })
                }}
                disabledDate={disabledDate}
                className={curItem === "custom-time-choose" ? 'ant-picker-highlight' : 'ant-picker-silent'} />
        </ConfigProvider>)
}