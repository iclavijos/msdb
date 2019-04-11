/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryResultDeleteDialogComponent } from 'app/entities/event-entry-result/event-entry-result-delete-dialog.component';
import { EventEntryResultService } from 'app/entities/event-entry-result/event-entry-result.service';

describe('Component Tests', () => {
    describe('EventEntryResult Management Delete Component', () => {
        let comp: EventEntryResultDeleteDialogComponent;
        let fixture: ComponentFixture<EventEntryResultDeleteDialogComponent>;
        let service: EventEntryResultService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEntryResultDeleteDialogComponent]
            })
                .overrideTemplate(EventEntryResultDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EventEntryResultDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryResultService);
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
