package com.icesoft.msdb.config;

import com.icesoft.msdb.security.*;
import com.icesoft.msdb.security.SecurityUtils;
import com.icesoft.msdb.security.oauth2.AudienceValidator;
import com.icesoft.msdb.security.oauth2.CustomClaimConverter;
import com.icesoft.msdb.security.oauth2.JwtGrantedAuthorityConverter;

import java.time.Duration;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.client.RestOperations;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;
import tech.jhipster.config.JHipsterProperties;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
public class SecurityConfiguration {

    private final JHipsterProperties jHipsterProperties;

    private final CorsFilter corsFilter;

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;
    @Value("${spring.security.oauth2.client.provider.oidc.jwk-set-uri}")
    private String jwkSetUri;

    private final SecurityProblemSupport problemSupport;

    public SecurityConfiguration(CorsFilter corsFilter, JHipsterProperties jHipsterProperties, SecurityProblemSupport problemSupport) {
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
        this.jHipsterProperties = jHipsterProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .and()
            .addFilterBefore(corsFilter, CsrfFilter.class)
            .exceptionHandling()
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport)
        .and()
            .headers()
            .contentSecurityPolicy(jHipsterProperties.getSecurity().getContentSecurityPolicy())
        .and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
        .and()
            .permissionsPolicy().policy("camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()")
        .and()
            .frameOptions()
            .deny()
        .and()
            .authorizeHttpRequests(authz -> {
                authz
                    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .antMatchers("/app/**/*.{js,html}").permitAll()
                    .antMatchers("/i18n/**").permitAll()
                    .antMatchers("/content/**").permitAll()
                    .antMatchers("/swagger-ui/**").permitAll()
                    .antMatchers("/test/**").permitAll()

                    .antMatchers("/api/authenticate").permitAll()
                    .antMatchers("/api/auth-info").permitAll()
                    .antMatchers("/api/admin/**").hasAuthority(AuthoritiesConstants.ADMIN)

                    .antMatchers("/api/home/**").permitAll()
                    .antMatchers("/api/timezones").permitAll()
                    .antMatchers("/api/event-editions/calendar/**").permitAll()

                    // Public endpoints for mobile app
                    .antMatchers("/api/series").permitAll()

                    .antMatchers("/api/**").authenticated()
                    .antMatchers("/management/health").permitAll()
                    .antMatchers("/management/health/**").permitAll()
                    .antMatchers("/management/info").permitAll()
                    .antMatchers("/management/prometheus").permitAll()
                    .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN);
            })
        .oauth2Login();

//            // Start of "public" access
//            .antMatchers(HttpMethod.GET, "/api/series/**").permitAll()
////            .antMatchers(HttpMethod.GET, "/api/_search/series").permitAll()
////            .antMatchers(HttpMethod.GET, "/api/series-editions/**").permitAll()
////
////            .antMatchers(HttpMethod.GET, "/api/events/**").permitAll()
////            .antMatchers(HttpMethod.GET, "/api/event-editions/**").permitAll()
////            .antMatchers(HttpMethod.GET, "/api/event-editions/*/sessions").permitAll()
//            // .antMatchers(HttpMethod.GET, "/api/icalendar/**").permitAll()
//            // End of "public" access
//
//        .and()
//            .oauth2Login();
//        .and()
//            .oauth2ResourceServer()
//                .jwt()
//                .jwtAuthenticationConverter(authenticationConverter())
//                .and()
//            .and()
//                .oauth2Client();
        // @formatter:on

        return http.build();
    }

    Converter<Jwt, AbstractAuthenticationToken> authenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new JwtGrantedAuthorityConverter());
        return jwtAuthenticationConverter;
    }

    /**
     * Map authorities from "groups" or "roles" claim in ID Token.
     *
     * @return a {@link GrantedAuthoritiesMapper} that maps groups from
     * the IdP to Spring Security Authorities.
     */
    @Bean
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return authorities -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

            authorities.forEach(authority -> {
                // Check for OidcUserAuthority because Spring Security 5.2 returns
                // each scope as a GrantedAuthority, which we don't care about.
                if (authority instanceof OidcUserAuthority) {
                    OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                    mappedAuthorities.addAll(SecurityUtils.extractAuthorityFromClaims(oidcUserAuthority.getUserInfo().getClaims()));
                }
            });
            return mappedAuthorities;
        };
    }

    @Bean
    JwtDecoder jwtDecoder(ClientRegistrationRepository clientRegistrationRepository, RestTemplateBuilder restTemplateBuilder) {
        RestOperations rest = restTemplateBuilder
            .setConnectTimeout(Duration.ofSeconds(10))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
            .withJwkSetUri(jwkSetUri)
            .restOperations(rest)
            .build();

//        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(jHipsterProperties.getSecurity().getOauth2().getAudience());
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);
        jwtDecoder.setClaimSetConverter(
            new CustomClaimConverter(clientRegistrationRepository.findByRegistrationId("oidc"), restTemplateBuilder.build())
        );

        return jwtDecoder;
    }
}
