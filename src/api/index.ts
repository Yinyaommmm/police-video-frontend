/* eslint-disable @typescript-eslint/promise-function-async */
import { type AxiosProgressEvent } from "axios";
import instance from "./axios";

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
    files.forEach((image, index) => {
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
      formData.append("video", file); // 将文件添加到 FormData 对象
      try {
        const response = await instance.post("/upload", formData, {
          onUploadProgress,
        });
        console.log("index.ts Upload successful:", response.data);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    hello: async () => {
      return await instance.post("/hello");
    },
  },
};
