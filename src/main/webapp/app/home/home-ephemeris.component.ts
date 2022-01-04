import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class HomeEphemeris {
  name!: string;
  detail!: string;
  date!: string;
  age!: number;
  type!: string;
  place!: string;
}

@Component({
  selector: 'jhi-home-ephemeris',
  templateUrl: './home-ephemeris.component.html'
})
export class HomeEphemerisComponent implements OnInit {
  ephemeris: HomeEphemeris[] = [];
  years: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const date = new Date();
    this.http.get<HomeEphemeris[]>(`api/home/ephemeris/${date.getDate()}-${date.getMonth() + 1}`)
      .subscribe((res: HomeEphemeris[]) => {
        this.ephemeris = res;
        if (this.ephemeris.length > 0) {
          this.years = this.ephemeris.map((r: HomeEphemeris) => r.date[0]).filter(this.onlyUnique);
        } else {
          this.ephemeris = [];
          this.years = [];
        }
      });
  }

  private onlyUnique(value: string, index: number, self: string[]): boolean {
    return self.indexOf(value) === index;
  }
}
