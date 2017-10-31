package com.icesoft.msdb.config;

import io.github.jhipster.config.JHipsterProperties;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.Duration;
import org.ehcache.expiry.Expirations;
import org.ehcache.jsr107.Eh107Configuration;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
@AutoConfigureAfter(value = { MetricsConfiguration.class })
@AutoConfigureBefore(value = { WebConfigurer.class, DatabaseConfiguration.class })
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(Expirations.timeToLiveExpiration(Duration.of(ehcache.getTimeToLiveSeconds(), TimeUnit.SECONDS)))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.icesoft.msdb.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.icesoft.msdb.domain.SocialUserConnection.class.getName(), jcacheConfiguration);
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
