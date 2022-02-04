import { Pipe, PipeTransform } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';

import { DateTime } from 'luxon';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService) {}

  transform(value?: DateTime, pattern = 'DDD'): string {
    if (!value) {
      return '';
    }

    if (Array.isArray(value)) {
      const copyValue = Object.assign([], value);
      value = DateTime.fromObject({
        year: copyValue[0],
        month: copyValue[1],
        day: copyValue[2]
      });
    }
    let localeKey = this.sessionStorageService.retrieve('locale');
    if (!localeKey) {
      this.accountService.getAuthenticationState()
        .subscribe(
          account =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            localeKey = account!.langKey);
    }

    return value.setLocale(localeKey).toFormat(pattern);
  }
}
