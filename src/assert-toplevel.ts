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

// https://discourse.mozilla.org/t/mv3-can-addlistener-be-inside-a-function/112834/4?u=metastable

// top level starts as TRUE and is set to FALSE the moment current loop finishes.
let isTopLevel = true;
Promise.resolve().then(() => isTopLevel = false);

// throws if executed later on - this helps with Manifest V3 migration!
export function assertTopLevel() {
  if (!isTopLevel) throw Error('WARNING: this is not a top level event loop');
}
