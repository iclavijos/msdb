/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackUpdateComponent } from 'app/entities/racetrack/racetrack-update.component';
import { RacetrackService } from 'app/entities/racetrack/racetrack.service';
import { Racetrack } from 'app/shared/model/racetrack.model';

describe('Component Tests', () => {
    describe('Racetrack Management Update Component', () => {
        let comp: RacetrackUpdateComponent;
        let fixture: ComponentFixture<RacetrackUpdateComponent>;
        let service: RacetrackService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [RacetrackUpdateComponent]
            })
                .overrideTemplate(RacetrackUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RacetrackUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RacetrackService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Racetrack(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.racetrack = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Racetrack();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.racetrack = entity;
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
