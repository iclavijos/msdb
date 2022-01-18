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

    if (value instanceof Date || Array.isArray(value)) {
      // } && !value.lang) {
      let valueCopy: any;
      if (Array.isArray(value)) {
        valueCopy = Object.assign([], value);
        valueCopy[1] = value[1] - 1;
      } else {
        valueCopy = value;
      }

      momentDate = moment(valueCopy);
    } else {
      momentDate = value;
    }
    return momentDate.locale(this.translateService.currentLang).format(pattern);
  }
}
