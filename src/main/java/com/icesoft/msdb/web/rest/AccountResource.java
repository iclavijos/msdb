package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.service.UserService;
import com.icesoft.msdb.service.dto.UserDTO;

import com.icesoft.msdb.service.dto.UserSubscriptionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserService userService;

    public AccountResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * {@code GET  /authenticate} : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request.
     * @return the login if the user is authenticated.
     */
    @GetMapping("/authenticate")
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @param principal the current user; resolves to {@code null} if not authenticated.
     * @return the current user.
     * @throws AccountResourceException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    @SuppressWarnings("unchecked")
    public UserDTO getAccount(Principal principal) {
        if (principal instanceof AbstractAuthenticationToken) {
            return userService.getUserFromAuthentication((AbstractAuthenticationToken) principal);
        } else {
            throw new AccountResourceException("User could not be found");
        }
    }

    /**
     * {@code GET  /account/subscriptions} : get the current user's subscriptions.
     *
     * @param principal the current user; resolves to {@code null} if not authenticated.
     * @return the current user's suscriptions.
     * @throws AccountResourceException {@code 500 (Internal Server Error)} if the user's subscriptions couldn't be returned.
     */
    @GetMapping("/account/subscriptions")
    @SuppressWarnings("unchecked")
    public Set<UserSubscriptionDTO> getSubscriptions(Principal principal) {
        if (principal instanceof AbstractAuthenticationToken) {
            UserDTO user = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal);
            return userService.getUserSuscriptions(user.getEmail()).parallelStream().
                map(UserSubscriptionDTO::new).collect(Collectors.toSet());
        } else {
            throw new AccountResourceException("User could not be found");
        }
    }

    /**
     * {@code POST  /account/subscriptions} : sets the current user's subscriptions.
     *
     * @param principal the current user; resolves to {@code null} if not authenticated.
     * @return operation result
     * @throws AccountResourceException {@code 500 (Internal Server Error)} if the user's subscriptions couldn't be returned.
     */
    @PutMapping("/account/subscriptions")
    @Transactional
    public ResponseEntity<Void> updateSubscriptions(
        Principal principal,
        @RequestBody Set<UserSubscriptionDTO> subscriptions) throws URISyntaxException {
        if (principal instanceof AbstractAuthenticationToken) {
            UserDTO user = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal);

            userService.setUserSuscriptions(user, subscriptions);
        } else {
            throw new AccountResourceException("User could not be found");
        }
        return ResponseEntity.created(new URI("/api/account/subscriptions")).build();
    }

    @PostMapping("/account/device")
    @Transactional
    public ResponseEntity<Void> registerDeviceToken(
        Principal principal,
        @RequestBody String deviceId) throws URISyntaxException {
        log.debug("Registering device {} for user", deviceId);
        if (principal instanceof AbstractAuthenticationToken) {
            UserDTO user = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal);
            log.debug("User for device: {} - {} {}", user.getEmail(), user.getFirstName(), user.getLastName());
            // This should be handled better, but it's a bit overkill to define a class for a single attribute
            Assert.notNull(deviceId, "A deviceId must be provided");
            userService.registerDevice(user, deviceId);
        } else {
            throw new AccountResourceException("User could not be found");
        }
        return ResponseEntity.created(new URI("/")).build();
    }

    @DeleteMapping("/account/device/{deviceId}")
    @Transactional
    public ResponseEntity<Void> removeDeviceToken(
        Principal principal,
        @PathVariable String deviceId) throws URISyntaxException {
        log.debug("Removing device {} for user", deviceId);
        if (principal instanceof AbstractAuthenticationToken) {
            UserDTO user = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal);
            log.debug("User for device: {} - {} {}", user.getEmail(), user.getFirstName(), user.getLastName());
            userService.removeDevice(user, deviceId);
        } else {
            throw new AccountResourceException("User could not be found");
        }
        return ResponseEntity.ok().build();
    }
}
