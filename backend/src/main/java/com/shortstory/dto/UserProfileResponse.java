package com.shortstory.dto;

public class UserProfileResponse {

    private final long userId;
    private final String userName;
    private final String nationality;
    private final String hometown;
    private final String gender;

    public UserProfileResponse(long userId, String userName, String nationality, String hometown,String gender) {
        this.userId = userId;
        this.userName = userName;
        this.nationality = nationality;
        this.hometown = hometown;
        this.gender = gender;
    }

    public long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getNationality() {
        return nationality;
    }

    public String getHometown() {
        return hometown;
    }

    public String getGender(){
        return gender;
    }
}
