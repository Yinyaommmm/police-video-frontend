import { model } from "@/packages/model";

export interface DataModel {
  prompt: string;
  quantity: number;
  file: File | undefined;
  age: number;
  method: string;
  gender: string;
  currentAge: number;
  clear: number;
}

export const $Data = model<DataModel>("DATA", {
  prompt: "",
  quantity: 1,
  file: undefined,
  age: 30,
  method: "",
  gender: "女",
  currentAge: 0,
  clear: 1,
});
