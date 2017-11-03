/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EngineDetailComponent } from '../../../../../../main/webapp/app/entities/engine/engine-detail.component';
import { EngineService } from '../../../../../../main/webapp/app/entities/engine/engine.service';
import { Engine } from '../../../../../../main/webapp/app/entities/engine/engine.model';

describe('Component Tests', () => {

    describe('Engine Management Detail Component', () => {
        let comp: EngineDetailComponent;
        let fixture: ComponentFixture<EngineDetailComponent>;
        let service: EngineService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EngineDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EngineService,
                    JhiEventManager
                ]
            }).overrideTemplate(EngineDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EngineDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EngineService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Engine(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.engine).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
