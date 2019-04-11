/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { FuelProviderDeleteDialogComponent } from 'app/entities/fuel-provider/fuel-provider-delete-dialog.component';
import { FuelProviderService } from 'app/entities/fuel-provider/fuel-provider.service';

describe('Component Tests', () => {
    describe('FuelProvider Management Delete Component', () => {
        let comp: FuelProviderDeleteDialogComponent;
        let fixture: ComponentFixture<FuelProviderDeleteDialogComponent>;
        let service: FuelProviderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [FuelProviderDeleteDialogComponent]
            })
                .overrideTemplate(FuelProviderDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FuelProviderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuelProviderService);
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
