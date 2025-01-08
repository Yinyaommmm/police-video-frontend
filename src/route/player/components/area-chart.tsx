import { EventsInfoRes } from "@/api";
import { calcNeedTime } from "@/utils";
import { useAnimate } from "framer-motion";
import { FC, useEffect, useState } from "react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, TooltipProps, } from "recharts"
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface AreaChartsProps extends EventsInfoRes {
    click: (second: number) => void
}

const CustomTooltip = ({
    active,
    payload,
}: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; // 获取数据项
        const time = data.start_time; // 获取时间属性
        const value = data.num; // 获取值属性
        return (
            <div className="px-3 bg-slate-900 flex flex-col  rounded-md relative -top-1">
                <p className="text-sm text-[#a7ff1a] my-1">时间节点：{calcNeedTime(time)}</p>
                <p className="text-sm  text-[#47d4ff] my-1">事件数量： {value}</p>
            </div>
        );
    }

    return null;
};

export const AreaCharts: FC<AreaChartsProps> = ({ info, click }) => {
    const [key, setKey] = useState(0);
    const [scope, animate] = useAnimate()
    useEffect(() => {
        setKey(prevKey => prevKey + 1);
        animate(scope.current, {
            opacity: [0, 1], // 从0到1的透明度变化
        }, { duration: 0.6 }) // 动画持续时间
    }, [info]);
    const handleChartClick: CategoricalChartFunc = (e) => {
        const { activePayload } = e;
        if (activePayload && activePayload.length > 0) {
            const clickedData = activePayload[0].payload
            const time = clickedData.start_time;
            click(time);
        }
    };
    return <ResponsiveContainer width="100%" height="100%" ref={scope} >
        <AreaChart onClick={handleChartClick} key={`AreaCharts-${key}`} width={500} height={100} data={info} margin={{ right: 0 }}>
            <Tooltip content={<CustomTooltip />} />
            <Area dataKey="num" type="monotone" stroke="#81d100" fill="#1aaad6" />
        </AreaChart>
    </ResponsiveContainer >
}