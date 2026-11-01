package com.shortstory.model;

public class StorySummaryResponse {

    private final long id;
    private final String title;
    private final String content;
    private final String visibility;
    private final long userId;
    private final String username;

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public long getUserId(){
        return userId;
    }
    public String getVisibility(){return visibility;}

    public String getUsername(){return username;}

    public StorySummaryResponse(long id, String title, String content, String visibility,long userId,String username) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.visibility = visibility;
        this.userId = userId;
        this.username = username;
    }

    public StorySummaryResponse(long id, String title, String content, String visibility,String username) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.visibility = visibility;
        this.userId = 0;
        this.username = username;
    }

}
