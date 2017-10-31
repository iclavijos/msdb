import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { TyreProviderDetailComponent } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider-detail.component';
import { TyreProviderService } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider.service';
import { TyreProvider } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider.model';

describe('Component Tests', () => {

    describe('TyreProvider Management Detail Component', () => {
        let comp: TyreProviderDetailComponent;
        let fixture: ComponentFixture<TyreProviderDetailComponent>;
        let service: TyreProviderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [TyreProviderDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    TyreProviderService,
                    JhiEventManager
                ]
            }).overrideTemplate(TyreProviderDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TyreProviderDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TyreProviderService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new TyreProvider(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.tyreProvider).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
