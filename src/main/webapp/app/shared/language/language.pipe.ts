import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {
    private languages: any = {
        'ca': 'Català',
        'en': 'English',
        'es': 'Español',
        'gl': 'Galego',
    };
    transform(lang: string): string {
        return this.languages[lang];
    }
}
