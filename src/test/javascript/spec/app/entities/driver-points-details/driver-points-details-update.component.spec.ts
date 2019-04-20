/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { DriverPointsDetailsUpdateComponent } from 'app/entities/driver-points-details/driver-points-details-update.component';
import { DriverPointsDetailsService } from 'app/entities/driver-points-details/driver-points-details.service';
import { DriverPointsDetails } from 'app/shared/model/driver-points-details.model';

describe('Component Tests', () => {
    describe('DriverPointsDetails Management Update Component', () => {
        let comp: DriverPointsDetailsUpdateComponent;
        let fixture: ComponentFixture<DriverPointsDetailsUpdateComponent>;
        let service: DriverPointsDetailsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [DriverPointsDetailsUpdateComponent]
            })
                .overrideTemplate(DriverPointsDetailsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DriverPointsDetailsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DriverPointsDetailsService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new DriverPointsDetails(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.driverPointsDetails = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new DriverPointsDetails();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.driverPointsDetails = entity;
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
