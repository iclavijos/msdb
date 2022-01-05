import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'racetrackLengthMask' })
export class RacetrackLengthPipe implements PipeTransform {

  transform(length: number): string {
    if (!length) {
      return '';
    }

    const km = Math.round((length / 1000) * 1000) / 1000;
    const mi = Math.round(length * 0.000621371 * 1000) / 1000;

    return `${km}km / ${mi}mi`;
  }
}
