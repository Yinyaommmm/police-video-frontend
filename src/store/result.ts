import { model } from "@/packages/model";

export interface ResultModel {
  results: string[];
}

export const $Result = model<ResultModel>("RESULT", {
  results: [],
});
