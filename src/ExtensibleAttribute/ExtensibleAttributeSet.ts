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

import { ExtensibleAttributeDictionary } from "./ExtensibleAttributeDIctionary";
import { ExtensibleAttribute } from "./ExtensibleAttribute";

export class ExtensibleAttributeSet<T> {
  public readonly target: T;
  private readonly attributesDictionary: ExtensibleAttributeDictionary;

  public constructor(target: T, attributesDictionary: ExtensibleAttributeDictionary) {
    this.target = target;
    this.attributesDictionary = attributesDictionary;
  }

  public getAttribute<S>(attribute: ExtensibleAttribute<S>): S | undefined {
    return attribute.getValue(this.attributesDictionary);
  }

  public setAttribute<S>(attribute: ExtensibleAttribute<S>, value: S): void {
    attribute.setValue(this.attributesDictionary, value);
  }
}
