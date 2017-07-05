import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EventEntryDetailComponent } from '../../../../../../main/webapp/app/entities/event-entry/event-entry-detail.component';
import { EventEntryService } from '../../../../../../main/webapp/app/entities/event-entry/event-entry.service';
import { EventEntry } from '../../../../../../main/webapp/app/entities/event-entry/event-entry.model';

describe('Component Tests', () => {

    describe('EventEntry Management Detail Component', () => {
        let comp: EventEntryDetailComponent;
        let fixture: ComponentFixture<EventEntryDetailComponent>;
        let service: EventEntryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEntryDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventEntryService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventEntryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventEntry(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventEntry).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
