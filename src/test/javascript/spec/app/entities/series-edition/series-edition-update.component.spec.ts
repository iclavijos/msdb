import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { SeriesEditionUpdateComponent } from 'app/entities/series-edition/series-edition-update.component';
import { SeriesEditionService } from 'app/entities/series-edition/series-edition.service';
import { SeriesEdition } from 'app/shared/model/series-edition.model';

describe('Component Tests', () => {
  describe('SeriesEdition Management Update Component', () => {
    let comp: SeriesEditionUpdateComponent;
    let fixture: ComponentFixture<SeriesEditionUpdateComponent>;
    let service: SeriesEditionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [SeriesEditionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(SeriesEditionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SeriesEditionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SeriesEditionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SeriesEdition(123);
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
        const entity = new SeriesEdition();
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
