import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'dDate'
})
export class DynamicDatePipe implements PipeTransform {

    constructor(private _translateService: TranslateService) {

    }

    public transform(value: any, pattern = 'mediumDate'): any {
        const ngPipe = new DatePipe(this._translateService.currentLang);
        return ngPipe.transform(value, pattern);
    }

}
