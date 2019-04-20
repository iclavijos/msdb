/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { FuelProviderDetailComponent } from 'app/entities/fuel-provider/fuel-provider-detail.component';
import { FuelProvider } from 'app/shared/model/fuel-provider.model';

describe('Component Tests', () => {
    describe('FuelProvider Management Detail Component', () => {
        let comp: FuelProviderDetailComponent;
        let fixture: ComponentFixture<FuelProviderDetailComponent>;
        const route = ({ data: of({ fuelProvider: new FuelProvider(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [FuelProviderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(FuelProviderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FuelProviderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.fuelProvider).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
