package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.User;
import lombok.Data;

/**
 * A DTO representing a user, with only the public attributes.
 */
@Data
public class UserDTO {

    private String id;
    private String login;
    private String email;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }

    public UserDTO(User user) {
        this.id = user.getId();
        // Customize it here if you need, or not, firstName/lastName/etc
        this.login = user.getLogin();
        this.email = user.getEmail();
    }

}
