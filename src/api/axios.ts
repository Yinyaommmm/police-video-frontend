import { $UI } from "@/store/ui";
import axios from "axios";

const instance = axios.create({
  baseURL: "api/v1",
  timeout: 30000,
});
instance.defaults.headers.get["Content-Type"] = "application/json";
instance.defaults.headers.get.Accept = "*/*";
instance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  async (err) => {
    return await Promise.reject(err);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.config.responseType === "blob") {
      return res; // 返回整个响应以便下载
    }
    return res.data;
  },
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  (err) => {
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

export default instance;
