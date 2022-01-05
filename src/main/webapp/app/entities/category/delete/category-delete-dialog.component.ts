import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategory } from '../category.model';
import { CategoryService } from '../service/category.service';

@Component({
  templateUrl: './category-delete-dialog.component.html',
})
export class CategoryDeleteDialogComponent {
  category?: ICategory;

  constructor(protected categoryService: CategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
