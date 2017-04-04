import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export const MIN_DATE: NgbDateStruct = {year: 1890, month: 1, day: 1};
export const CURRENT_DATE: NgbDateStruct = {year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate()};
export const MAX_DATE: NgbDateStruct = {year: (new Date()).getFullYear()+1, month: 12, day: 31};