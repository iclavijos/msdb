/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ChassisDetailComponent } from '../../../../../../main/webapp/app/entities/chassis/chassis-detail.component';
import { ChassisService } from '../../../../../../main/webapp/app/entities/chassis/chassis.service';
import { Chassis } from '../../../../../../main/webapp/app/entities/chassis/chassis.model';

describe('Component Tests', () => {

    describe('Chassis Management Detail Component', () => {
        let comp: ChassisDetailComponent;
        let fixture: ComponentFixture<ChassisDetailComponent>;
        let service: ChassisService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [ChassisDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ChassisService,
                    JhiEventManager
                ]
            }).overrideTemplate(ChassisDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChassisDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChassisService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Chassis(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.chassis).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
