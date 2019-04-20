package com.icesoft.msdb.web.rest.errors;

public class EmailAlreadyUsedException extends BadRequestAlertException {

	private static final long serialVersionUID = -3999721326565563687L;

	public EmailAlreadyUsedException() {
        super(ErrorConstants.EMAIL_ALREADY_USED_TYPE, "Email is already in use!", "userManagement", "emailexists");
    }
}
