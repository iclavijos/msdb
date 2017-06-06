import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "racetrackLengthMask" })
export class RacetrackLengthPipe implements PipeTransform {
  
  constructor() {
  }

  transform(length: number): string {
      if (!length) return;
      
      let result = '';
      
      let km = Math.round((length / 1000) * 100) / 100;
      let mi = Math.round((length * 0.000621371) * 100) / 100;
      
      return km + 'km / ' + mi + 'mi';
  }

}