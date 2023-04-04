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

import { PromiseUtils } from "./PromiseUtils";

export class ViewRefreshHandler {
  public static readonly RERENDERING_DELAY = 100;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _renderCallback: (... args: any[]) => Promise<void>;

  private _isRendering = false;
  private _rerenderingRequested = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(renderCallback: (... args: any[]) => Promise<void>) {
    this._renderCallback = renderCallback;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async render(... args: any[]): Promise<void> {
    if (this._isRendering) {
      this._rerenderingRequested = true;
      return;
    }

    for (;;) {
      this._isRendering = true;
      this._rerenderingRequested = false;

      try {
        await this._renderCallback(... args);
      } finally {
        this._isRendering = false;
      }
      if (this._rerenderingRequested) {
        await PromiseUtils.sleep(ViewRefreshHandler.RERENDERING_DELAY);
        continue;
      }
      break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public renderInBackground(... args: any[]): void {
    this.render(... args).catch((e) => {
      console.error(e);
    });
  }
}
