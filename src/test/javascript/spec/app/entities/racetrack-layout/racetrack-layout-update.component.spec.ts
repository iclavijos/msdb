/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackLayoutUpdateComponent } from 'app/entities/racetrack-layout/racetrack-layout-update.component';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/racetrack-layout.service';
import { RacetrackLayout } from 'app/shared/model/racetrack-layout.model';

describe('Component Tests', () => {
    describe('RacetrackLayout Management Update Component', () => {
        let comp: RacetrackLayoutUpdateComponent;
        let fixture: ComponentFixture<RacetrackLayoutUpdateComponent>;
        let service: RacetrackLayoutService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [RacetrackLayoutUpdateComponent]
            })
                .overrideTemplate(RacetrackLayoutUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RacetrackLayoutUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RacetrackLayoutService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new RacetrackLayout(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.racetrackLayout = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new RacetrackLayout();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.racetrackLayout = entity;
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
