jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventSessionService } from '../service/event-session.service';

import { EventSessionComponent } from './event-session.component';

describe('EventSession Management Component', () => {
  let comp: EventSessionComponent;
  let fixture: ComponentFixture<EventSessionComponent>;
  let service: EventSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventSessionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(EventSessionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventSessionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventSessionService);

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
    expect(comp.eventSessions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
