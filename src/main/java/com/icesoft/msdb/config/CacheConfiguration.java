package com.icesoft.msdb.config;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;
    private final javax.cache.configuration.Configuration<Object, Object> longLivedCacheConfiguration;
    private final javax.cache.configuration.Configuration<Object, Object> alwaysCacheConfiguration;
    private final javax.cache.configuration.Configuration<Object, Object> oneDayCacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());

        longLivedCacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
        		CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                        ResourcePoolsBuilder.heap(100))
                        .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.of(172800, ChronoUnit.SECONDS))) //TODO: Externalize
                        .build());
        oneDayCacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
        		CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                        ResourcePoolsBuilder.heap(100))
                        .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.of(24 * 60 * 60, ChronoUnit.SECONDS))) //TODO: Externalize
                        .build());

        alwaysCacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
        		CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                        ResourcePoolsBuilder.heap(2000)) //TODO: Externalize
        				.withExpiry(ExpiryPolicyBuilder.noExpiration())
                        .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.icesoft.msdb.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.icesoft.msdb.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.icesoft.msdb.domain.User.class.getName());
            createCache(cm, com.icesoft.msdb.domain.Authority.class.getName());
            createCache(cm, com.icesoft.msdb.domain.User.class.getName() + ".authorities");
            // jhipster-needle-ehcache-add-entry

            createCache(cm, com.icesoft.msdb.domain.EventSession.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Category.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Country.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.DriverEventPoints.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Driver.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Engine.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Engine.class.getName() + ".evolutions", jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Event.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Event.class.getName() + ".editions", jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.EventEdition.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.EventEditionEntry.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.EventEntryResult.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Chassis.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Chassis.class.getName() + ".evolutions", jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.FuelProvider.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.PointsSystem.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Racetrack.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Racetrack.class.getName() + ".layouts", jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.RacetrackLayout.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Series.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Series.class.getName() + ".editions", jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.SeriesEdition.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.Team.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.TeamEventPoints.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.ManufacturerEventPoints.class.getName(), jcacheConfiguration);
            createCache(cm, com.icesoft.msdb.domain.TyreProvider.class.getName(), jcacheConfiguration);

            createCache(cm, "homeInfo", jcacheConfiguration);
            createCache(cm, "calendar", jcacheConfiguration);
            createCache(cm, "timezones", oneDayCacheConfiguration);

            createCache(cm, "driversStandingsCache", longLivedCacheConfiguration);
            createCache(cm, "teamsStandingsCache", longLivedCacheConfiguration);
            createCache(cm, "manufacturersStandingsCache", longLivedCacheConfiguration);
            createCache(cm, "pointRaceByRace", longLivedCacheConfiguration);
            createCache(cm, "resultsRaceByRace", longLivedCacheConfiguration);
            createCache(cm, "lapsDriversCache", longLivedCacheConfiguration);
            createCache(cm, "lapsAveragesCache", longLivedCacheConfiguration);
            createCache(cm, "positionsCache", longLivedCacheConfiguration);

            createCache(cm, "winnersCache", alwaysCacheConfiguration);
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName, javax.cache.configuration.Configuration config) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, config);
    }

}
