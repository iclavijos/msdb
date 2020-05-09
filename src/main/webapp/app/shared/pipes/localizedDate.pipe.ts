import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Moment } from 'moment';
import * as moment from 'moment';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: Moment, pattern = 'LLL'): any {
    let momentDate: Moment;
    if (!value.lang) {
      momentDate = moment(value);
    } else {
      momentDate = value;
    }
    return momentDate.lang(this.translateService.currentLang).format(pattern);
  }
}
