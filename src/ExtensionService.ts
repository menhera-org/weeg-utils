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

export class ExtensionService {
  private static readonly INSTANCE = new ExtensionService();

  public static getInstance() {
    return ExtensionService.INSTANCE;
  }

  private constructor() {
    // nothing.
  }

  public getInternalUuid(): string {
    return new URL(browser.runtime.getURL('/')).hostname;
  }

  public getVersion(): string {
    return browser.runtime.getManifest().version;
  }

  public async isAllowedInPrivateBrowsing(): Promise<boolean> {
    const allowed = await browser.extension.isAllowedIncognitoAccess();
    return allowed;
  }

  public isBackgroundPage(): boolean {
    if (!browser.extension?.getBackgroundPage) {
      return false; // content scripts
    }
    // This returns null on private browsing mode. But in non-split setup, background page is not private browsing mode.
    return browser.extension.getBackgroundPage() === window;
  }
}
