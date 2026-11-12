package com.shortstory.dto;

public class UserCommentResponse {

    private final long userId;
    private final String username;
    private final String content;

    public long getUserId() {
        return userId;
    }

    public String getUsername(){return username;}
    public String getContent(){return content;}

    public UserCommentResponse(long userId,String username,String content){
        this.userId = userId;
        this.username = username;
        this.content = content;
    }
}
