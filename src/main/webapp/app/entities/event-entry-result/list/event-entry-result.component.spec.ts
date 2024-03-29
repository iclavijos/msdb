jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventEntryResultService } from '../service/event-entry-result.service';

import { EventEntryResultComponent } from './event-entry-result.component';

describe('EventEntryResult Management Component', () => {
  let comp: EventEntryResultComponent;
  let fixture: ComponentFixture<EventEntryResultComponent>;
  let service: EventEntryResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventEntryResultComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(EventEntryResultComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventEntryResultComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventEntryResultService);

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
    expect(comp.eventEntryResults?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
