import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private GENERIC_POSTER_URL = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1590250486/affiche/generic';
  private GENERIC_FACE_URL = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1518113603/generic.png';

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public getGenericRacePoster(): string {
    const number = this.getRandomInt(1, 6);
    return `${this.GENERIC_POSTER_URL}${number}.jpg`;
  }

  public getFaceUrl(portraitUrl: string, width: number, height: number): string {
    const tmpUrl = portraitUrl ? portraitUrl : this.GENERIC_FACE_URL;

    let url = tmpUrl.replace('upload/', `upload/w_${width},h_${height},c_thumb,g_face,r_max/`);
    const pos = url.lastIndexOf('.');
    if (pos > -1) {
      url = url.substring(0, pos);
    }
    url += '.png';

    return url;
  }
}
