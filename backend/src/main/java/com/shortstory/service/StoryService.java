package com.shortstory.service;

import com.shortstory.dto.UserCommentRequest;
import com.shortstory.dto.UserCommentResponse;
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
    public Story getPublicStory(long storyId){
        return storyRepository.getPublicStory(storyId);
    }

    public List<StorySummaryResponse> getPublicStories(int page, int size){
        List<StorySummaryResponse> publicStories = storyRepository.getPublicStories(page,size);
        return publicStories;
    }

    public List<StorySummaryResponse> getPublicStoryByUser(long userId, int page, int size){
        return storyRepository.getPublicStoriesByUser(userId,page,size);
    }
    public Story getStory(long storyId,long userId){
        return storyRepository.getStory(storyId,userId);
    }

    public UserCommentResponse addComment(long storyId, long userId,UserCommentRequest userCommentRequest){return storyRepository.addComment(storyId, userId, userCommentRequest);}

    public long addGoodReview(long storyId,long userId){return storyRepository.addGoodReview(storyId,userId);}

    public boolean hasGoodReviewedStory(long storyId, long userId){
        boolean goodReviewAdded = storyRepository.hasUserLikedStory(storyId, userId);
        return goodReviewAdded;
    }
    public List<UserCommentResponse> getComments(long storyId, int page, int size){return storyRepository.getComments(storyId,page,size);}
}
