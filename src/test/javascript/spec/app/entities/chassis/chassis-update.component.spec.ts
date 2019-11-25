import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { ChassisUpdateComponent } from 'app/entities/chassis/chassis-update.component';
import { ChassisService } from 'app/entities/chassis/chassis.service';
import { Chassis } from 'app/shared/model/chassis.model';

describe('Component Tests', () => {
  describe('Chassis Management Update Component', () => {
    let comp: ChassisUpdateComponent;
    let fixture: ComponentFixture<ChassisUpdateComponent>;
    let service: ChassisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [ChassisUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ChassisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChassisUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChassisService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Chassis(123);
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
        const entity = new Chassis();
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
