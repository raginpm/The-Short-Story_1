package com.shortstory.controller;

import com.shortstory.model.*;
import com.shortstory.service.AuthService;
import com.shortstory.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    public AuthController(AuthService authService,JwtService jwtService){
        this.authService = authService;
        this.jwtService = jwtService;
    }
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        boolean created = authService.signUp(request);
        if(!created){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        if(loginResponse == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader){
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = authService.getUserById(userId);
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getUserName(),
                        user.getEmail()
                );

        return ResponseEntity.status(HttpStatus.OK).body(response);
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
