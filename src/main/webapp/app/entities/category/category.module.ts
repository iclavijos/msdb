import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategoryComponent } from './list/category.component';
import { CategoryDetailComponent } from './detail/category-detail.component';
import { CategoryUpdateComponent } from './update/category-update.component';
import { CategoryDeleteDialogComponent } from './delete/category-delete-dialog.component';
import { CategoryRoutingModule } from './route/category-routing.module';

@NgModule({
  imports: [SharedModule, CategoryRoutingModule],
  declarations: [CategoryComponent, CategoryDetailComponent, CategoryUpdateComponent, CategoryDeleteDialogComponent],
  entryComponents: [CategoryDeleteDialogComponent],
})
export class CategoryModule {}
