/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EngineDetailComponent } from 'app/entities/engine/engine-detail.component';
import { Engine } from 'app/shared/model/engine.model';

describe('Component Tests', () => {
    describe('Engine Management Detail Component', () => {
        let comp: EngineDetailComponent;
        let fixture: ComponentFixture<EngineDetailComponent>;
        const route = ({ data: of({ engine: new Engine(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EngineDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(EngineDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EngineDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.engine).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
