/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { SeriesEditionDetailComponent } from 'app/entities/series-edition/series-edition-detail.component';
import { SeriesEdition } from 'app/shared/model/series-edition.model';

describe('Component Tests', () => {
    describe('SeriesEdition Management Detail Component', () => {
        let comp: SeriesEditionDetailComponent;
        let fixture: ComponentFixture<SeriesEditionDetailComponent>;
        const route = ({ data: of({ seriesEdition: new SeriesEdition(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [SeriesEditionDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SeriesEditionDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SeriesEditionDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.seriesEdition).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
