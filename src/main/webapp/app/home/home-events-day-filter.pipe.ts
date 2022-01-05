import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { HomeEvent } from './home-events.component';

import { Moment } from 'moment';

@Pipe({
  name: 'eventsDayFilter'
})
@Injectable()
export class HomeEventsDayFilter implements PipeTransform {
  transform(items: HomeEvent[], filter: any): HomeEvent[] {
    return items.filter(
          (item: HomeEvent) =>
            (item.sessionStartTime as Moment).format('LL') === filter);
  }
}
