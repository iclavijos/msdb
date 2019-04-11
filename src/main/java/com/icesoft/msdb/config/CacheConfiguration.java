package com.icesoft.msdb.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.icesoft.msdb.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.EventSession.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Category.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Driver.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Driver.class.getName() + ".participations", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Team.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Team.class.getName() + ".participations", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Engine.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Engine.class.getName() + ".evolutions", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Event.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Event.class.getName() + ".editions", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.EventEdition.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.EventEntry.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.EventEntry.class.getName() + ".participants", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.EventEntryResult.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Chassis.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Chassis.class.getName() + ".evolutions", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.FuelProvider.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.PointsSystem.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Racetrack.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Racetrack.class.getName() + ".layouts", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.RacetrackLayout.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Series.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Series.class.getName() + ".editions", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.SeriesEdition.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.TyreProvider.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.DriverPointsDetails.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
