import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ephemerisYearFilter'
})
@Injectable()
export class EphemerisYearFilter implements PipeTransform {
  transform(items: any[], filter: string): any[] {
    return items.filter(item => item.date[0] === filter);
  }
}
