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

import browser from 'webextension-polyfill';
import { SetMap } from 'weeg-types';

export type MessageListener = (message: unknown, sender: browser.Runtime.MessageSender) => Promise<unknown> | void;

export class MessagingService {
  private static readonly _instance = new MessagingService();

  public static getInstance(): MessagingService {
    return this._instance;
  }

  private readonly _setMap = new SetMap<string, MessageListener>();

  private constructor() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.onMessage(message, sender, sendResponse).catch((e) => {
        console.error(e);
      });
      return true;
    });
  }

  private async onMessage(message: unknown, sender: browser.Runtime.MessageSender, sendResponse: (response: unknown) => void): Promise<unknown> {
    if (null == message || typeof message !== 'object' || !('type' in message) || typeof message.type !== 'string') {
      return;
    }
    const { type } = message;
    const listeners = this._setMap.get(type);
    if (null == listeners || listeners.size < 1) {
      return;
    }
    const payload = ('payload' in message) ? message.payload : undefined;
    const promises = [... listeners].map(listener => listener(payload, sender)).filter(promise => null != promise) as Promise<unknown>[];
    if (0 === promises.length) {
      return;
    }
    const result = await Promise.race(promises);
    console.debug('MessagingService.onMessage', type, message, sender, result);
    sendResponse(result);
    return result;
  }

  public addListener(type: string, listener: MessageListener): void {
    this._setMap.addItem(type, listener);
  }

  public removeListener(type: string, listener: MessageListener): void {
    this._setMap.deleteItem(type, listener);
  }

  public async sendMessage(type: string, message: unknown): Promise<unknown> {
    const result = await browser.runtime.sendMessage({
      type,
      payload: message,
    });
    return result;
  }

  public sendMessageAndIgnoreResponse(type: string, message: unknown): void {
    this.sendMessage(type, message).catch(() => {
      // ignore
    });
  }
}
