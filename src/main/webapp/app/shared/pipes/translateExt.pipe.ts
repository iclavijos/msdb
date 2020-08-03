import { PipeTransform, Pipe, Injectable } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Injectable()
@Pipe({ name: 'translateExt', pure: false })
export class TranslateExtPipe extends TranslatePipe implements PipeTransform {
  transform(query: string, ...args: any[]): any {
    const result = super.transform(query, args);
    if (result instanceof Array) {
      return result.join('\n');
    } else {
      return result;
    }
  }
}
