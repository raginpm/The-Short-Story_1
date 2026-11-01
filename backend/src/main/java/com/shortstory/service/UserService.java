package com.shortstory.service;

import com.shortstory.dto.UpdateProfileRequest;
import com.shortstory.dto.UserProfileResponse;
import com.shortstory.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    public UserProfileResponse getUserProfile(long userId){
        return userRepository.getUserProfile(userId);
    }

    public int updateProfile(long userid, UpdateProfileRequest request){
        return userRepository.updateProfile(userid,request);
    }
}
