package com.shortstory.service;

import com.shortstory.model.Story;
import com.shortstory.model.StorySummaryResponse;
import com.shortstory.repository.StoryRepository;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
public class StoryService {
    private final StoryRepository storyRepository;

    public StoryService(StoryRepository storyRepository){
        this.storyRepository = storyRepository;
    }

    public long saveStory(Story story){
        return storyRepository.save(story);
    }

    public int updateStory(long id, Story story){
        return storyRepository.updateStory(id,story);
    }

    public List<StorySummaryResponse> getStorySummaries(long userId){
        return storyRepository.getStoriesByUserId(userId);
    }
    public Story getStory(long storyId,long userId){
        return storyRepository.getStory(storyId,userId);
    }
}
