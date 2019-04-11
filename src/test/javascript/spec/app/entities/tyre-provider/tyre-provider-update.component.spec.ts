/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { TyreProviderUpdateComponent } from 'app/entities/tyre-provider/tyre-provider-update.component';
import { TyreProviderService } from 'app/entities/tyre-provider/tyre-provider.service';
import { TyreProvider } from 'app/shared/model/tyre-provider.model';

describe('Component Tests', () => {
    describe('TyreProvider Management Update Component', () => {
        let comp: TyreProviderUpdateComponent;
        let fixture: ComponentFixture<TyreProviderUpdateComponent>;
        let service: TyreProviderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [TyreProviderUpdateComponent]
            })
                .overrideTemplate(TyreProviderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TyreProviderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TyreProviderService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TyreProvider(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tyreProvider = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TyreProvider();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tyreProvider = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
