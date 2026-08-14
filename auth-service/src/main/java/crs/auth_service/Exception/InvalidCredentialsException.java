package crs.auth_service.Exception;

public class InvalidCredentialsException
        extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}