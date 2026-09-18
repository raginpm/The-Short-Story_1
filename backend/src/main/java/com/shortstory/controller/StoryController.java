package com.shortstory.controller;

import com.shortstory.dto.StoryResponse;
import com.shortstory.model.Story;
import com.shortstory.model.StorySummaryResponse;
import com.shortstory.service.JwtService;
import com.shortstory.service.StoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;

@RestController
@RequestMapping("/stories")
public class StoryController {

    private final StoryService storyService;
    private final JwtService jwtService;

    public StoryController(StoryService storyService, JwtService jwtService){
        this.storyService = storyService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<StoryResponse> saveStory(@RequestHeader("Authorization") String authorizationHeader,
                                   @RequestBody Story story){

        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        story.setUserId(userId);
        long storyId = storyService.saveStory(story);
        StoryResponse response = new StoryResponse(storyId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStory(@PathVariable long id,
                            @RequestBody Story story,
                            @RequestHeader("Authorization") String authorizationHeader){

        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        story.setUserId(userId);
        int rawUpdated = storyService.updateStory(id,story);
        if(rawUpdated == 0){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    //@GetMapping
    //public List<StorySummaryResponse> getStorySummery1(@RequestParam long userId){
    //    return storyService.getStorySummaries(userId);
    //}

    @GetMapping
    public ResponseEntity<List<StorySummaryResponse>> getStorySummery(@RequestHeader("Authorization") String  authorizationHeader){
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<StorySummaryResponse> stories =  storyService.getStorySummaries(userId);
        return ResponseEntity.status(HttpStatus.OK).body(stories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStory(@PathVariable long id,
                          @RequestHeader("Authorization") String authorizationHeader){

        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Story story =  storyService.getStory(id, userId);
        if(story == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(story);
    }

    private Long getUserIdFromAuthorizationHeader(
            String authorizationHeader) {

        if (authorizationHeader == null) {
            return null;
        }
        if (!authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authorizationHeader.substring(7);
        try {
            return jwtService.getUserId(token);
        } catch (Exception e) {
            return null;
        }
    }
}
