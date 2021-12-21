import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-home-ephemeris',
  templateUrl: './home-ephemeris.component.html'
})
export class HomeEphemerisComponent implements OnInit {
  today: string;
  ephemeris = [];
  years: string[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const date = new Date();
    this.http.get<HttpResponse<any[]>>(`api/home/ephemeris/${date.getDate()}-${date.getMonth() + 1}`).subscribe(res => {
      this.ephemeris = res.body;
      if (this.ephemeris) {
        this.years = this.ephemeris.map(r => r.date[0]).filter(this.onlyUnique);
      } else {
        this.ephemeris = [];
        this.years = [];
      }
    });
  }

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
