package com.icesoft.msdb.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EnableJpaRepositories({ "com.icesoft.msdb.repository" })
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableTransactionManagement
@EnableElasticsearchRepositories("com.icesoft.msdb.repository.search")
@EnableMongoAuditing
public class DatabaseConfiguration {

//    private final Logger log = LoggerFactory.getLogger(DatabaseConfiguration.class);

//    @Autowired
//    private MongoMappingContext mongoMappingContext;
//
//    @Bean
//    public MappingMongoConverter mongoConverter(MongoDbFactory mongoFactory) throws Exception {
//        DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoFactory);
//        MappingMongoConverter mongoConverter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
//        mongoConverter.setMapKeyDotReplacement("_");
//
//        return mongoConverter;
//    }
}
