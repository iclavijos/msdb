/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { CategoryDeleteDialogComponent } from 'app/entities/category/category-delete-dialog.component';
import { CategoryService } from 'app/entities/category/category.service';

describe('Component Tests', () => {
    describe('Category Management Delete Component', () => {
        let comp: CategoryDeleteDialogComponent;
        let fixture: ComponentFixture<CategoryDeleteDialogComponent>;
        let service: CategoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [CategoryDeleteDialogComponent]
            })
                .overrideTemplate(CategoryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CategoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
