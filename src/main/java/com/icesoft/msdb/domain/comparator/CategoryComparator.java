package com.icesoft.msdb.domain.comparator;

import com.icesoft.msdb.domain.Category;
import lombok.EqualsAndHashCode;

import java.util.Comparator;

@EqualsAndHashCode
public class CategoryComparator implements Comparator<Category> {

    @Override
    public int compare(Category o1, Category o2) {
        return o1.getRelevance().compareTo(o2.getRelevance());
    }

}
