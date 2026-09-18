package com.shortstory.model;

public class User {

    private Long id;
    private String userName;
    private String email;
    private String password;

    public User(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public User(Long id, String name, String email, String password) {
        this.id = id;
        this.userName = name;
        this.email = email;
        this.password = password;
    }
    // getters and setters
}
