package com.icesoft.msdb;

public class MSDBException extends RuntimeException {
	private static final long serialVersionUID = -8770181313637973392L;
	
	public MSDBException(String message) {
		super(message);
	}
	
	public MSDBException(Throwable t) {
		super(t);
	}
	

}
