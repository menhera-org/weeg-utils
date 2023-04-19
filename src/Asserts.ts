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

import { ExtensionService } from "./ExtensionService";
import { assertTopLevel } from "./assert-toplevel";

const extensionService = ExtensionService.getInstance();

export class Asserts {
  /**
   * Assert some operation is called from the top level (the first event loop) of the script.
   */
  public static assertTopLevel(): void {
    assertTopLevel();
  }

  /**
   * Forbid some operation in background pages.
   */
  public static assertNotBackgroundScript(): void {
    if (extensionService.isBackgroundPage()) {
      throw new Error('This function cannot be called from the background script.');
    }
  }

  /**
   * Assert some operation is called from the background script.
   */
  public static assertBackgroundScript(): void {
    if (!extensionService.isBackgroundPage()) {
      throw new Error('This function can only be called from the background script.');
    }
  }

  /**
   * Assert some operation is called from the top level of the background script.
   */
  public static assertTopLevelInBackgroundScript(): void {
    if (extensionService.isBackgroundPage()) {
      assertTopLevel();
    }
  }
}
