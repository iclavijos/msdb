/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { SeriesEditionDeleteDialogComponent } from 'app/entities/series-edition/series-edition-delete-dialog.component';
import { SeriesEditionService } from 'app/entities/series-edition/series-edition.service';

describe('Component Tests', () => {
    describe('SeriesEdition Management Delete Component', () => {
        let comp: SeriesEditionDeleteDialogComponent;
        let fixture: ComponentFixture<SeriesEditionDeleteDialogComponent>;
        let service: SeriesEditionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [SeriesEditionDeleteDialogComponent]
            })
                .overrideTemplate(SeriesEditionDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SeriesEditionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SeriesEditionService);
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
