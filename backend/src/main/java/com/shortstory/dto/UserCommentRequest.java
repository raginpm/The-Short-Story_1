package com.shortstory.dto;

import java.time.LocalDateTime;

public class UserCommentRequest {

    private final String content;

    public String getContent() {
        return content;
    }

    public UserCommentRequest(String content){
        this.content = content;
    }
}
