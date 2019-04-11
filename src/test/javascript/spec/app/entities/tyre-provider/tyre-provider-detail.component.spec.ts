/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { TyreProviderDetailComponent } from 'app/entities/tyre-provider/tyre-provider-detail.component';
import { TyreProvider } from 'app/shared/model/tyre-provider.model';

describe('Component Tests', () => {
    describe('TyreProvider Management Detail Component', () => {
        let comp: TyreProviderDetailComponent;
        let fixture: ComponentFixture<TyreProviderDetailComponent>;
        const route = ({ data: of({ tyreProvider: new TyreProvider(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [TyreProviderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TyreProviderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TyreProviderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.tyreProvider).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
