import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';

@Component({
  selector: 'jhi-event-edition-delete-dialog',
  templateUrl: './event-edition-delete-dialog.component.html'
})
export class EventEditionDeleteDialogComponent {
  eventEdition: IEventEdition;

  constructor(
    protected eventEditionService: EventEditionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.eventEditionService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'eventEditionListModification',
        content: 'Deleted an eventEdition'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-event-edition-delete-popup',
  template: ''
})
export class EventEditionDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(EventEditionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.eventEdition = eventEdition;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/event-edition', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/event-edition', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
