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
import { EventSink } from 'weeg-events';

export type AlarmSchedule = {
  delayInMinutes?: number;
  periodInMinutes?: number;
};

export class Alarm {
  public readonly onAlarm = new EventSink<string>();

  public readonly name: string;
  private readonly schedule: AlarmSchedule;

  public constructor(name: string, schedule: AlarmSchedule) {
    this.name = name;
    this.schedule = schedule;

    if (!browser.alarms) {
      throw new Error('Alarm API is not supported.');
    }

    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === this.name) {
        this.onAlarm.dispatch(this.name);
      }
    });

    browser.alarms.create(this.name, this.schedule);
  }
}
