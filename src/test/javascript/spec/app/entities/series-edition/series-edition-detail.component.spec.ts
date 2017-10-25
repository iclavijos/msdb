import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SeriesEditionDetailComponent } from '../../../../../../main/webapp/app/entities/series-edition/series-edition-detail.component';
import { SeriesEditionService } from '../../../../../../main/webapp/app/entities/series-edition/series-edition.service';
import { SeriesEdition } from '../../../../../../main/webapp/app/entities/series-edition/series-edition.model';

describe('Component Tests', () => {

    describe('SeriesEdition Management Detail Component', () => {
        let comp: SeriesEditionDetailComponent;
        let fixture: ComponentFixture<SeriesEditionDetailComponent>;
        let service: SeriesEditionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [SeriesEditionDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SeriesEditionService,
                    JhiEventManager
                ]
            }).overrideTemplate(SeriesEditionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SeriesEditionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SeriesEditionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new SeriesEdition(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.seriesEdition).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
