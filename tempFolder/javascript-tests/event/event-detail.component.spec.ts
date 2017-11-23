/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EventDetailComponent } from '../../../../../../main/webapp/app/entities/event/event-detail.component';
import { EventService } from '../../../../../../main/webapp/app/entities/event/event.service';
import { Event } from '../../../../../../main/webapp/app/entities/event/event.model';

describe('Component Tests', () => {

    describe('Event Management Detail Component', () => {
        let comp: EventDetailComponent;
        let fixture: ComponentFixture<EventDetailComponent>;
        let service: EventService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule, RouterTestingModule],
                declarations: [EventDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Event(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.event).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
