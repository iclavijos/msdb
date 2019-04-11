/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EventEntryResultDetailComponent } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result-detail.component';
import { EventEntryResultService } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result.service';
import { EventEntryResult } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result.model';

describe('Component Tests', () => {

    describe('EventEntryResult Management Detail Component', () => {
        let comp: EventEntryResultDetailComponent;
        let fixture: ComponentFixture<EventEntryResultDetailComponent>;
        let service: EventEntryResultService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEntryResultDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventEntryResultService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventEntryResultDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntryResultDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryResultService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventEntryResult(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventEntryResult).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
