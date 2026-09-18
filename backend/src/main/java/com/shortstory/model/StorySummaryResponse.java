package com.shortstory.model;

public class StorySummaryResponse {
    private final long id;
    private final String title;
    private final String content;

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public StorySummaryResponse(long id, String title, String content) {
        this.id = id;
        this.title = title;
        this.content = content;
    }


}
