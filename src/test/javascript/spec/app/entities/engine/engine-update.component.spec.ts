/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EngineUpdateComponent } from 'app/entities/engine/engine-update.component';
import { EngineService } from 'app/entities/engine/engine.service';
import { Engine } from 'app/shared/model/engine.model';

describe('Component Tests', () => {
    describe('Engine Management Update Component', () => {
        let comp: EngineUpdateComponent;
        let fixture: ComponentFixture<EngineUpdateComponent>;
        let service: EngineService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EngineUpdateComponent]
            })
                .overrideTemplate(EngineUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EngineUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EngineService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Engine(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.engine = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Engine();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.engine = entity;
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
