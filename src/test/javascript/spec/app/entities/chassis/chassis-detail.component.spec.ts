/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { ChassisDetailComponent } from 'app/entities/chassis/chassis-detail.component';
import { Chassis } from 'app/shared/model/chassis.model';

describe('Component Tests', () => {
    describe('Chassis Management Detail Component', () => {
        let comp: ChassisDetailComponent;
        let fixture: ComponentFixture<ChassisDetailComponent>;
        const route = ({ data: of({ chassis: new Chassis(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [ChassisDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ChassisDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ChassisDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.chassis).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
