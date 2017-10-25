import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CategoryDetailComponent } from '../../../../../../main/webapp/app/entities/category/category-detail.component';
import { CategoryService } from '../../../../../../main/webapp/app/entities/category/category.service';
import { Category } from '../../../../../../main/webapp/app/entities/category/category.model';

describe('Component Tests', () => {

    describe('Category Management Detail Component', () => {
        let comp: CategoryDetailComponent;
        let fixture: ComponentFixture<CategoryDetailComponent>;
        let service: CategoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [CategoryDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategoryService,
                    JhiEventManager
                ]
            }).overrideTemplate(CategoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Category(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.category).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
