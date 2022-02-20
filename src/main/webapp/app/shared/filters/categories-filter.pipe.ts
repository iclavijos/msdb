import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ICategory } from 'app/entities/category/category.model';

@Pipe({
  name: 'categoriesFilter'
})
@Injectable()
export class CategoriesFilter implements PipeTransform {

  transform(items: ICategory[], filterText: string): ICategory[] {
    if (!filterText) {
      return items;
    }

    return items.filter(it => it.name!.toLowerCase().includes(filterText.toLowerCase()));
  }

}
