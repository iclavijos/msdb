import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { FuelProviderUpdateComponent } from 'app/entities/fuel-provider/fuel-provider-update.component';
import { FuelProviderService } from 'app/entities/fuel-provider/fuel-provider.service';
import { FuelProvider } from 'app/shared/model/fuel-provider.model';

describe('Component Tests', () => {
  describe('FuelProvider Management Update Component', () => {
    let comp: FuelProviderUpdateComponent;
    let fixture: ComponentFixture<FuelProviderUpdateComponent>;
    let service: FuelProviderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [FuelProviderUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(FuelProviderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FuelProviderUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FuelProviderService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new FuelProvider(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new FuelProvider();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
