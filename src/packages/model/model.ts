import { useCallback } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Handler } from "./types";

/**
 * 创建数据模型
 * @param name 模型名字
 * @param initial 初始化数据
 * @return  模型操作句柄
 */
export const model = <S, N extends string = string>(
  name: Uppercase<N>,
  initial: S,
) => {
  const $model = create(
    persist(
      immer(
        devtools(() => initial, {
          name,
          enabled: model.devtools,
          trace: true,
        }),
      ),
      {
        name,
        // storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      },
    ),
  );

  /**
   * 模型操作句柄
   */
  const handler: Handler<S> = {
    use(selector = (s: S) => s, deps: unknown[] = [], isEqual = Object.is) {
      // eslint-disable-next-line
      const callback = useCallback(selector, deps);
      return $model(callback, isEqual);
    },

    get: $model.getState,

    update(reason, updater) {
      $model.setState(updater, false, reason);
    },

    subscribe: $model.subscribe,
  };

  return handler;
};

/**
 * 是否启用 [Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 * @default false
 */
model.devtools = false;
