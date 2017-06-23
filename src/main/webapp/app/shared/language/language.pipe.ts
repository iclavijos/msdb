import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {
    private languages: any = {
        'ca-ES': 'Català',
        'en-EN': 'English',
        'es-ES': 'Español',
        'gl-ES': 'Galego',
    };
    transform(lang: string): string {
        return this.languages[lang];
    }
}
