import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { EventEntry } from '../../entities/event-entry';

@Pipe({
  name: 'eventEntryCategoryFilter'
})
@Injectable()
export class EventEntryCategoryFilter implements PipeTransform {
    
  transform(items: any[], filter: string): any {
      if (!filter || filter === 'ALL') return items;

      return items.filter(item => {
          if (item.category !== undefined) {
              return item.category.shortname === filter;
          } else {
              return item.entry.category.shortname === filter;
          }
      });
  }
  
}