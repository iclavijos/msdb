import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor() {}

  ngOnInit() {}
}
