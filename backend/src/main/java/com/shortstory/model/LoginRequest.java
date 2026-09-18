package com.shortstory.model;

public class LoginRequest {

    private String identifier;
    private String password;

    public LoginRequest(String nameOrEmail, String password) {
        this.identifier = nameOrEmail;
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
