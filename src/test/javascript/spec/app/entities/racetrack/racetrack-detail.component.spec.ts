/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { RacetrackDetailComponent } from '../../../../../../main/webapp/app/entities/racetrack/racetrack-detail.component';
import { RacetrackService } from '../../../../../../main/webapp/app/entities/racetrack/racetrack.service';
import { Racetrack } from '../../../../../../main/webapp/app/entities/racetrack/racetrack.model';

describe('Component Tests', () => {

    describe('Racetrack Management Detail Component', () => {
        let comp: RacetrackDetailComponent;
        let fixture: ComponentFixture<RacetrackDetailComponent>;
        let service: RacetrackService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [RacetrackDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    RacetrackService,
                    JhiEventManager
                ]
            }).overrideTemplate(RacetrackDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RacetrackDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RacetrackService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Racetrack(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.racetrack).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
