jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RacetrackLayoutService } from '../service/racetrack-layout.service';

import { RacetrackLayoutComponent } from './racetrack-layout.component';

describe('RacetrackLayout Management Component', () => {
  let comp: RacetrackLayoutComponent;
  let fixture: ComponentFixture<RacetrackLayoutComponent>;
  let service: RacetrackLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RacetrackLayoutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(RacetrackLayoutComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RacetrackLayoutComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RacetrackLayoutService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.racetrackLayouts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
