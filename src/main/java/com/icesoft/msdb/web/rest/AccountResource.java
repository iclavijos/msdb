package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.service.UserService;
import com.icesoft.msdb.service.dto.UserDTO;

import com.icesoft.msdb.service.dto.UserSubscriptionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
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
}
