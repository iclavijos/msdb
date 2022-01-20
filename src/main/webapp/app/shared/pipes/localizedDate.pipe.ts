import { Pipe, PipeTransform } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import * as dayjs from 'dayjs';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private sessionStorageService: SessionStorageService) {}

  transform(value?: dayjs.Dayjs, pattern = 'LL'): string {
    let momentDate: dayjs.Dayjs;

    if (!value) {
      return '';
    }

    if (value instanceof Date || Array.isArray(value)) {
      // } && !value.lang) {
      let valueCopy: any;
      if (Array.isArray(value)) {
        valueCopy = Object.assign([], value);
        valueCopy[1] = value[1] - 1;
      } else {
        valueCopy = value;
      }

      momentDate = valueCopy.clone();
    } else {
      momentDate = value;
    }
    const localeKey = this.sessionStorageService.retrieve('locale');
    return momentDate.locale(localeKey).format(pattern);
  }
}
