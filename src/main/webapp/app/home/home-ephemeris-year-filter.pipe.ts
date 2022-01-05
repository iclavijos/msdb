import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { HomeEphemeris } from './home-ephemeris.component';

@Pipe({
  name: 'ephemerisYearFilter'
})
@Injectable()
export class HomeEphemerisYearFilter implements PipeTransform {
  transform(items: HomeEphemeris[], filter: string): HomeEphemeris[] {
    return items.filter((item: HomeEphemeris) => item.date[0] === filter);
  }
}
