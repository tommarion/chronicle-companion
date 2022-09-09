package com.webversive.chroniclecompanion.exception;

public class UnauthorizedException extends Exception {
    public UnauthorizedException(String msg) {
        super(msg);
    }

    public UnauthorizedException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
