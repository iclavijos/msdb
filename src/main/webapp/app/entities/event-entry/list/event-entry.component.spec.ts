jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventEntryService } from '../service/event-entry.service';

import { EventEntryComponent } from './event-entry.component';

describe('EventEntry Management Component', () => {
  let comp: EventEntryComponent;
  let fixture: ComponentFixture<EventEntryComponent>;
  let service: EventEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventEntryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(EventEntryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventEntryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventEntryService);

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
    expect(comp.eventEntries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
