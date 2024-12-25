import React, {
  type MouseEvent,
  useRef,
  useState,
  type FC,
  useEffect,
  useMemo,
} from "react";
import { twMerge } from "tailwind-merge";

export interface SliderProps {
  max: number;
  min: number;
  step: number;
  showStep?: boolean;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export const Slider: FC<SliderProps> = (props) => {
  const { max, min, step, showStep = false, onChange, defaultValue } = props;
  const [value, setValue] = useState<number>(defaultValue ?? min);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const mouseDownRef = useRef<boolean>(false);
  const steps = useMemo(() => {
    return Array.from(
      { length: Math.ceil((max - min) / step) - 1 },
      (_, index) => min + (index + 1) * step,
    );
  }, [step]);

  const handleMouseMove = (event: MouseEvent): void => {
    if (sliderRef.current !== null && mouseDownRef.current) {
      const offset =
        event.clientX - sliderRef.current.getBoundingClientRect().left;

      const percentage = (offset / sliderRef.current.offsetWidth) * (max - min);
      let newValue = Math.round((percentage + min) / step) * step;
      if (newValue > max) newValue = max;
      if (newValue < min) newValue = min;
      setValue(newValue);
      if (onChange !== undefined) onChange(newValue);
    }
  };

  const handleMouseUp = (): void => {
    setMouseDown(false);
    mouseDownRef.current = false;
  };

  useEffect(() => {
    if (onChange !== undefined) onChange(value);
    window.addEventListener("mouseup", handleMouseUp);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="px-1 flex items-center w-full">
      <div
        ref={sliderRef}
        className="relative h-1 w-full bg-[#333a45] rounded-full"
      >
        <div
          className="z-10 bg-[#a4e408] rounded-full h-1"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
        {showStep &&
          steps.map((item, index) => (
            <div
              key={`slider-${index}`}
              className={twMerge(
                "absolute z-10 top-[-2px] h-2 w-2 bg-[#333a45] rounded-full -translate-x-1/2",
                value >= item && "bg-[#a4e408]",
              )}
              style={{
                left: `${((item - min) / (max - min)) * 100}%`,
              }}
              onClick={() => {
                setValue(item);
                if (onChange !== undefined) onChange(item);
              }}
            />
          ))}
        <div
          className="absolute flex items-center justify-center top-[-16px] h-9 w-9 z-20 bg-transparent -translate-x-1/2"
          style={{
            left: `${((value - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={() => {
            setMouseDown(true);
            mouseDownRef.current = true;
          }}
        >
          <div
            className={twMerge(
              "h-[14px] w-[14px] rounded-full transition-all bg-[linear-gradient(90.81deg,#a3f545,#27db93)]",
              mouseDown && "scale-[1.2]",
            )}
          />
        </div>
      </div>
    </div>
  );
};
