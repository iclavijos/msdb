import { Pipe, PipeTransform } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';

import * as dayjs from 'dayjs';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService) {}

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

    let localeKey = this.sessionStorageService.retrieve('locale');
    if (!localeKey) {
      this.accountService.getAuthenticationState()
        .subscribe(
          account =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            localeKey = account!.langKey);
    }
    return momentDate.locale(localeKey).format(pattern);
  }
}
