import { $UI } from "@/store/ui";
import axios from "axios";

const instance_long = axios.create({
  baseURL: "api/v1",
  timeout: 3600*1000, // 20M的网速最大请求文件72G
});
instance_long.defaults.headers.get["Content-Type"] = "application/json";
instance_long.defaults.headers.get.Accept = "*/*";
instance_long.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;

// 请求拦截器
instance_long.interceptors.request.use(
  (config) => {
    return config;
  },
  async (err) => {
    return await Promise.reject(err);
  },
);

// 响应拦截器
instance_long.interceptors.response.use(
  (res) => {
    if (res.config.responseType === "blob") {
      return res; // 返回整个响应以便下载
    }
    return res.data;
  },
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  (err) => {
    console.log(err)
    if (err.response.status === 401 || err.response.status === 422) {
      $UI.update("unauthorized", (draft) => {
        draft.login = false;
        draft.loading = false;
        draft.loadingCover = false;
      });
      localStorage.setItem("token", "");
      return Promise.reject(err);
    } else if (String(err.response.status).startsWith("4")) {
      alert("收到错误答复");
      return Promise.reject(err);
    }
    $UI.update("error info", (draft) => {
      draft.messageDisplay = true;
      draft.loading = false;
      draft.loadingCover = false;
      if (err.response.data.detail !== undefined) {
        draft.messageContent = err.response.data.detail;
      } else {
        draft.messageContent = "内部错误，请联系开发者";
      }
    });
    return Promise.reject(err);
  },
);

export default instance_long;
