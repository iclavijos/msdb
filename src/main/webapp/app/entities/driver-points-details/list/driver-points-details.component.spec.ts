jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DriverPointsDetailsService } from '../service/driver-points-details.service';

import { DriverPointsDetailsComponent } from './driver-points-details.component';

describe('DriverPointsDetails Management Component', () => {
  let comp: DriverPointsDetailsComponent;
  let fixture: ComponentFixture<DriverPointsDetailsComponent>;
  let service: DriverPointsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DriverPointsDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(DriverPointsDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DriverPointsDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DriverPointsDetailsService);

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
    expect(comp.driverPointsDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
