package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import com.icesoft.msdb.domain.SeriesCategoryDriverChampion;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SeriesCategoryDriverChampionRepository extends JpaRepository<SeriesCategoryDriverChampion, Long> {

    @Query("select scdc.driver from SeriesCategoryDriverChampion scdc where scdc.seriesEdition.id = ?1")
    List<Driver> getDriversChampions(Long seriesId);

    @Query("select scdc.driver from SeriesCategoryDriverChampion scdc where scdc.seriesEdition.id = ?1 and scdc.category.id = ?2")
    List<Driver> getDriversChampionsInCategory(Long seriesId, Long categoryId);
}
