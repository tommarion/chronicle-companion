package com.webversive.chroniclecompanion.exception;

import org.springframework.dao.DataAccessException;

public class DatabaseException extends DataAccessException {
    public DatabaseException(String msg) {
        super(msg);
    }

    public DatabaseException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
