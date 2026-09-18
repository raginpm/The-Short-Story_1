package com.shortstory.service;

import com.shortstory.model.LoginRequest;
import com.shortstory.model.LoginResponse;
import com.shortstory.model.SignupRequest;
import com.shortstory.model.User;
import com.shortstory.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,BCryptPasswordEncoder bCryptPasswordEncoder,JwtService jwtService){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest loginRequest){

        User user = userRepository.findByUsernameOrEmail(loginRequest.getIdentifier());
        if(user==null){
            return null;//throw new RuntimeException("Invalid username/email or password");
        }
        boolean passwordPasswordMatch = bCryptPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if(!passwordPasswordMatch){
            return null;//throw new RuntimeException("Invalid username/email or password");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponse(token);
    }

    public boolean signUp(SignupRequest signupRequest){
        if(userRepository.userNameExists(signupRequest.getUserName())){
            return false;
        }
        if(userRepository.emailExists(signupRequest.getEmail())){
            return false;
        }
        User user = new User();
        user.setUserName(signupRequest.getUserName());
        user.setEmail(signupRequest.getEmail());
        String hashedPassword = bCryptPasswordEncoder.encode(signupRequest.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return true;
    }

    public User getUserById(long userId){
        return userRepository.getUserById(userId);
    }
}
