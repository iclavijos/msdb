/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { DriverDetailComponent } from 'app/entities/driver/driver-detail.component';
import { Driver } from 'app/shared/model/driver.model';

describe('Component Tests', () => {
    describe('Driver Management Detail Component', () => {
        let comp: DriverDetailComponent;
        let fixture: ComponentFixture<DriverDetailComponent>;
        const route = ({ data: of({ driver: new Driver(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [DriverDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DriverDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DriverDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.driver).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
