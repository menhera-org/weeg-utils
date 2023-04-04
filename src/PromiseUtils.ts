/* -*- indent-tabs-mode: nil; tab-width: 2; -*- */
/* vim: set ts=2 sw=2 et ai : */
/**
  Copyright (C) 2023 WebExtensions Experts Group

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  @license
*/

export class PromiseUtils {
  public static createPromise<T>() {
    let resolve: (value: T) => void = () => {
      // this is never called.
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reject: (reason: any) => void = () => {
      // this is never called.
    };
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject,
    };
  }

  /**
   * Sleeps for the specified number of milliseconds.
   * This should not be used in nonpersistent background pages.
   * @param ms sleep time in milliseconds.
   * @returns Promise.
   */
  public static sleep(ms: number) {
    const { promise, resolve } = PromiseUtils.createPromise<void>();
    setTimeout(resolve, ms);
    return promise;
  }

  /**
   * This should not be used in nonpersistent background pages.
   */
  public static timeout(promise: Promise<unknown>, ms: number, message = "Timed out") {
    const timeout = PromiseUtils.sleep(ms).then(() => {
      throw new Error(message);
    });
    return Promise.race([promise, timeout]);
  }
}
