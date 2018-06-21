/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { FuelProviderDetailComponent } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider-detail.component';
import { FuelProviderService } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider.service';
import { FuelProvider } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider.model';

describe('Component Tests', () => {

    describe('FuelProvider Management Detail Component', () => {
        let comp: FuelProviderDetailComponent;
        let fixture: ComponentFixture<FuelProviderDetailComponent>;
        let service: FuelProviderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [FuelProviderDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    FuelProviderService,
                    JhiEventManager
                ]
            }).overrideTemplate(FuelProviderDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FuelProviderDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuelProviderService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FuelProvider(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.fuelProvider).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
