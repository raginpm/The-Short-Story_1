package com.shortstory.dto;

public class UserGoodReviewResponse {
    private final long goodReviewId;
    private final long storyId;
    private final long userId;

    public long getUserId() {
        return userId;
    }

    public long getStoryId() {
        return storyId;
    }

    public long getGoodReviewId() {
        return goodReviewId;
    }

    public UserGoodReviewResponse(long goodReviewId, long storyId, long userId) {
        this.goodReviewId = goodReviewId;
        this.storyId = storyId;
        this.userId = userId;
    }
}
