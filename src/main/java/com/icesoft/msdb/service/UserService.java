package com.icesoft.msdb.service;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.config.Constants;
import com.icesoft.msdb.domain.Authority;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.domain.UserSubscription;
import com.icesoft.msdb.repository.AuthorityRepository;
import com.icesoft.msdb.repository.UserRepository;
import com.icesoft.msdb.repository.UserSubscriptionRepository;
import com.icesoft.msdb.repository.search.UserSearchRepository;
import com.icesoft.msdb.security.SecurityUtils;
import com.icesoft.msdb.service.dto.AdminUserDTO;
import com.icesoft.msdb.service.dto.UserDTO;

import com.icesoft.msdb.service.dto.UserSubscriptionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final AuthorityRepository authorityRepository;

    private final UserSubscriptionRepository userSubscriptionRepository;

    private final CacheManager cacheManager;

    public UserService(
        UserRepository userRepository, UserSearchRepository userSearchRepository, AuthorityRepository authorityRepository,
        UserSubscriptionRepository userSubscriptionRepository, CacheManager cacheManager) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.cacheManager = cacheManager;
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils
            .getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userSearchRepository.save(user);
                this.clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    /**
     * Gets a list of all the authorities.
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    private User syncUserWithIdP(Map<String, Object> details, User user) {
        // save authorities in to sync user roles/groups between IdP and JHipster's local database
        Collection<String> dbAuthorities = getAuthorities();
        Collection<String> userAuthorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toList());
        for (String authority : userAuthorities) {
            if (!dbAuthorities.contains(authority)) {
                log.debug("Saving authority '{}' in local database", authority);
                Authority authorityToSave = new Authority();
                authorityToSave.setName(authority);
                authorityRepository.save(authorityToSave);
            }
        }
        // save account in to sync users between IdP and JHipster's local database
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(user.getEmail());
        if (existingUser.isPresent()) {
            // if IdP sends last updated information, use it to determine if an update should happen
            if (details.get("updated_at") != null) {
                Instant dbModifiedDate = existingUser.get().getLastModifiedDate();
                Instant idpModifiedDate = (Instant) details.get("updated_at");
                if (idpModifiedDate.isAfter(dbModifiedDate)) {
                    log.debug("Updating user '{}' in local database", user.getLogin());
                    updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
                }
                // no last updated info, blindly update
            } else {
                log.debug("Updating user '{}' in local database", user.getLogin());
                updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
            }
        } else {
            log.debug("Saving user '{}' in local database", user.getLogin());
            userRepository.save(user);
            this.clearUserCaches(user);
        }
        return user;
    }

    /**
     * Returns the user from an OAuth 2.0 login or resource server with JWT.
     * Synchronizes the user in the local repository.
     *
     * @param authToken the authentication token.
     * @return the user from the authentication.
     */
    @Transactional
    public AdminUserDTO getUserFromAuthentication(AbstractAuthenticationToken authToken) {
        Map<String, Object> attributes;
        if (authToken instanceof OAuth2AuthenticationToken) {
            attributes = ((OAuth2AuthenticationToken) authToken).getPrincipal().getAttributes();
        } else if (authToken instanceof JwtAuthenticationToken) {
            attributes = ((JwtAuthenticationToken) authToken).getTokenAttributes();
        } else {
            throw new IllegalArgumentException("AuthenticationToken is not OAuth2 or JWT!");
        }
        User user = getUser(attributes);
        List<String> groups = (List<String>)attributes.get("https://www.motorsports-database.racing/groups");
//        user.setAuthorities(groups.stream()
//            .map(authority -> {
//                Authority auth = new Authority();
//                auth.setName(authority);
//                return auth;
//            })
//            .collect(Collectors.toSet()));
        user.setAuthorities(
            authToken
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> {
                    Authority auth = new Authority();
                    auth.setName(authority);
                    return auth;
                })
                .collect(Collectors.toSet())
        );

        return new AdminUserDTO(syncUserWithIdP(attributes, user));
    }

    public Set<UserSubscription> getUserSuscriptions(String userEmail) {
        User user = userRepository.findOneByEmailIgnoreCase(userEmail).orElseThrow(
            () -> new MSDBException("User not found") // Should never happen
        );
        user.getSubscriptions().size();
        return user.getSubscriptions();
    }

    public void setUserSuscriptions(AdminUserDTO userDTO, Set<UserSubscriptionDTO> subscriptions) {
        User user = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).orElseThrow(
            () -> new MSDBException("User not found") // Should never happen
        );

        // TODO: Remove user from upcoming sessions notifications
        user.getSubscriptions().forEach(userSubs -> userSubscriptionRepository.delete(userSubs));
        user.removeAllSubscription();
        userRepository.save(user);
        subscriptions.stream()
            .map(subsDTO -> new UserSubscription(user.getId(), subsDTO))
            .forEach(subs -> userSubscriptionRepository.save(subs));
    }

    public void registerDevice(AdminUserDTO userDTO, String deviceId) {
        User user = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).orElseThrow(
            () -> new MSDBException("User not found") // Should never happen
        );
        user.addDeviceId(deviceId);
        userRepository.save(user);
    }

    public void removeDevice(AdminUserDTO userDTO, String deviceId) {
        User user = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).orElseThrow(
            () -> new MSDBException("User not found") // Should never happen
        );
        removeDevice(user, deviceId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void removeDevice(User user, String deviceId) {
        user.removeDeviceId(deviceId);
        userRepository.deleteDeviceId(deviceId);
    }

    private static User getUser(Map<String, Object> details) {
        User user = new User();
        Boolean activated = Boolean.TRUE;
        String sub = String.valueOf(details.get("sub"));
        String username = null;
        if (details.get("preferred_username") != null) {
            username = ((String) details.get("preferred_username")).toLowerCase();
        }
        // handle resource server JWT, where sub claim is email and uid is ID
        if (details.get("uid") != null) {
            user.setId((String) details.get("uid"));
            user.setLogin(sub);
        } else {
            user.setId(sub);
        }
        if (username != null) {
            user.setLogin(username);
        } else if (user.getLogin() == null) {
            if (details.get("email") != null) {
                user.setLogin((String) details.get("email"));
            } else {
                user.setLogin(user.getId());
            }
        }
        if (details.get("given_name") != null) {
            user.setFirstName((String) details.get("given_name"));
        } else if (details.get("name") != null) {
            user.setFirstName((String) details.get("name"));
        }
        if (details.get("family_name") != null) {
            user.setLastName((String) details.get("family_name"));
        }
        if (details.get("email_verified") != null) {
            activated = (Boolean) details.get("email_verified");
        }
        if (details.get("email") != null) {
            user.setEmail(((String) details.get("email")).toLowerCase());
        } else if (sub.contains("|") && (username != null && username.contains("@"))) {
            // special handling for Auth0
            user.setEmail(username);
        } else {
            user.setEmail(sub);
        }
        if (details.get("langKey") != null) {
            user.setLangKey((String) details.get("langKey"));
        } else if (details.get("locale") != null) {
            // trim off country code if it exists
            String locale = (String) details.get("locale");
            if (locale.contains("_")) {
                locale = locale.substring(0, locale.indexOf('_'));
            } else if (locale.contains("-")) {
                locale = locale.substring(0, locale.indexOf('-'));
            }
            user.setLangKey(locale.toLowerCase());
        } else {
            // set langKey to default if not specified by IdP
            user.setLangKey(Constants.DEFAULT_LANGUAGE);
        }
        if (details.get("picture") != null) {
            user.setImageUrl((String) details.get("picture"));
        }
        user.setActivated(activated);
        return user;
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }
}
