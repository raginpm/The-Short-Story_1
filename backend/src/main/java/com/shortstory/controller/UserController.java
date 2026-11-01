package com.shortstory.controller;

import com.shortstory.dto.UpdateProfileRequest;
import com.shortstory.dto.UserProfileResponse;
import com.shortstory.service.JwtService;
import com.shortstory.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService,JwtService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("me/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(@RequestHeader("Authorization") String authorizationHeader){
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.status(HttpStatus.OK).body(profile);
    }

    @PutMapping("me/profile")
    public ResponseEntity<Void> updateMyProfile(@RequestHeader("Authorization") String authorizationHeader,
                                                @RequestBody UpdateProfileRequest request){

        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if(userId == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.updateProfile(userId,request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("{userId}/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable long userId){
        UserProfileResponse userProfileResponse = userService.getUserProfile(userId);
        if(userProfileResponse == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(userProfileResponse);
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
