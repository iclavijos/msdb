package com.icesoft.msdb.web.rest.errors;

public class LoginAlreadyUsedException extends BadRequestAlertException {

	private static final long serialVersionUID = -6602008539768070094L;

	public LoginAlreadyUsedException() {
        super(ErrorConstants.LOGIN_ALREADY_USED_TYPE, "Login already in use", "userManagement", "userexists");
    }
}
