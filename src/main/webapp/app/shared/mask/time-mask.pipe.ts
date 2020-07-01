import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeMaskPipe' })
export class TimeMaskPipe implements PipeTransform {
  constructor() {}

  transform(value: any, includeMillis = true, handleHours?: boolean): string {
    if (!value) {
      return;
    }

    if (isNaN(Number(value))) {
      return value;
    }

    const timeMillis = Number(value);

    const millis = timeMillis % 10000;
    let seconds = Math.floor(timeMillis / 10000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    let result = '';

    const hours = Math.floor(minutes / 60);
    if (handleHours) {
      if (hours > 0) {
        minutes = minutes % 60;
        result = String(hours) + 'h';
      }
    }

    if (minutes > 0) {
      if (hours > 0 && minutes < 10) {
        result += '0' + String(minutes) + "'";
      } else {
        result += String(minutes) + "'";
      }
    } else if (hours > 0) {
      result += "00'";
    }

    if (seconds < 10 && (minutes > 0 || hours > 0)) {
      result += '0' + String(seconds);
    } else {
      result += String(seconds);
    }

    if (includeMillis) {
      if (millis > 0) {
        result += '.';
        const pad = '0000';
        result += pad.substring(0, pad.length - millis.toFixed(0).length) + millis.toFixed(0);
      } else {
        result += '.0000';
      }
    }
    return result;
  }
}
