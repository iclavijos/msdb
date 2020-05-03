import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Moment } from 'moment';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: Moment, pattern = 'LLL'): any {
    return value.lang(this.translateService.currentLang).format(pattern);
  }
}
