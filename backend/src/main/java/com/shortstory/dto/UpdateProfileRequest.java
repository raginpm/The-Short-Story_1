package com.shortstory.dto;

public class UpdateProfileRequest {

    private final String nationality;
    private final String hometown;
    private final String gender;

    public UpdateProfileRequest(String nationality, String hometown,String gender) {
        this.nationality = nationality;
        this.hometown = hometown;
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public String getHometown() {
        return hometown;
    }

    public String getGender() {
        return gender;
    }
}
