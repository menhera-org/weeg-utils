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
    browser.runtime.onMessage.addListener((message, sender) => this.onMessage(message, sender));
  }

  /**
   * Returns a promise of the first answer when a listener answers the message, and undefined otherwise.
   * Promising an answer that never comes makes the browser keep the message until the sender's page closes.
   */
  private onMessage(message: unknown, sender: browser.Runtime.MessageSender): Promise<unknown> | undefined {
    if (null == message || typeof message !== 'object' || !('type' in message) || typeof message.type !== 'string') {
      return undefined;
    }
    const { type } = message;
    const listeners = this._setMap.get(type);
    if (null == listeners || listeners.size < 1) {
      return undefined;
    }
    const payload = ('payload' in message) ? message.payload : undefined;
    const promises: Promise<unknown>[] = [];
    for (const listener of listeners) {
      try {
        const promise = listener(payload, sender);
        if (null != promise) {
          promises.push(promise);
        }
      } catch (e) {
        promises.push(Promise.reject(e));
      }
    }
    if (0 === promises.length) {
      return undefined;
    }
    return Promise.race(promises);
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
