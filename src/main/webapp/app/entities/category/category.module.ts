import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category-detail.component';
import { CategoryUpdateComponent } from './category-update.component';
import { CategoryDeletePopupComponent, CategoryDeleteDialogComponent } from './category-delete-dialog.component';
import { categoryRoute, categoryPopupRoute } from './category.route';

const ENTITY_STATES = [...categoryRoute, ...categoryPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoryComponent,
    CategoryDetailComponent,
    CategoryUpdateComponent,
    CategoryDeleteDialogComponent,
    CategoryDeletePopupComponent
  ]
})
export class MotorsportsDatabaseCategoryModule {}
