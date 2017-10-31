import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EventEditionDetailComponent } from '../../../../../../main/webapp/app/entities/event-edition/event-edition-detail.component';
import { EventEditionService } from '../../../../../../main/webapp/app/entities/event-edition/event-edition.service';
import { EventEdition } from '../../../../../../main/webapp/app/entities/event-edition/event-edition.model';

describe('Component Tests', () => {

    describe('EventEdition Management Detail Component', () => {
        let comp: EventEditionDetailComponent;
        let fixture: ComponentFixture<EventEditionDetailComponent>;
        let service: EventEditionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEditionDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventEditionService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventEditionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEditionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEditionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventEdition(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventEdition).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
