/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { PointsSystemUpdateComponent } from 'app/entities/points-system/points-system-update.component';
import { PointsSystemService } from 'app/entities/points-system/points-system.service';
import { PointsSystem } from 'app/shared/model/points-system.model';

describe('Component Tests', () => {
    describe('PointsSystem Management Update Component', () => {
        let comp: PointsSystemUpdateComponent;
        let fixture: ComponentFixture<PointsSystemUpdateComponent>;
        let service: PointsSystemService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [PointsSystemUpdateComponent]
            })
                .overrideTemplate(PointsSystemUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointsSystemUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsSystemService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PointsSystem(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.pointsSystem = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PointsSystem();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.pointsSystem = entity;
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
