import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';

@Component({
  selector: 'jhi-category-delete-dialog',
  templateUrl: './category-delete-dialog.component.html'
})
export class CategoryDeleteDialogComponent {
  category: ICategory;

  constructor(protected categoryService: CategoryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'categoryListModification',
        content: 'Deleted an category'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-category-delete-popup',
  template: ''
})
export class CategoryDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ category }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategoryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.category = category;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category', { outlets: { popup: null } }]);
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
