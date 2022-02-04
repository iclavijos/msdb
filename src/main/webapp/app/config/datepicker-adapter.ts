/**
 * Angular bootstrap Date adapter
 */
import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

@Injectable()
export class NgbDateLuxonAdapter extends NgbDateAdapter<DateTime> {
  fromModel(date: DateTime | null): NgbDateStruct | null {
    if (date?.isValid) {
      return { year: date.year, month: date.month + 1, day: date.day };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): DateTime | null {
    return date ?
      DateTime.fromObject(
        {
          year: date.year,
          month: date.month,
          day: date.day
        })
      : null;
  }
}
