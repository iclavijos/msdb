import { Title } from '@angular/platform-browser';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';

@Component({
  selector: 'jhi-category-detail',
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  category: ICategory;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ category }) => {
      this.category = category;
      this.titleService.setTitle(category.name);
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
