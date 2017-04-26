import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { EventEntry } from '../../entities/event-entry';

@Pipe({
  name: 'eventEntryCategoryFilter'
})
@Injectable()
export class EventEntryCategoryFilter implements PipeTransform {
    
  transform(entries: EventEntry[], filter: string): any {
      if (!filter || filter === 'ALL') return entries;
      
      return entries.filter(entry => entry.category.shortname === filter);
  }
  
}