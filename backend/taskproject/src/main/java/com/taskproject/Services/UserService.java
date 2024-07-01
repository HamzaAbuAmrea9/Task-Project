package com.taskproject.Services;



import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.taskproject.Repositories.UserRepository;
import com.taskproject.model.User;
import com.taskproject.model.UserUpdateRequest;



@CrossOrigin(origins = "*", maxAge = 3600)
@Service
public class UserService  {
@Autowired
    private final UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void updateProfileImage(Long userId, String filename) {
        // Retrieve user by ID from the repository
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Update the user's profileImage field with the new filename
        user.setProfileImage(filename);

        // Save the updated user object
        userRepository.save(user);
    }

  
    public User getUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);
    }
       
  
   
   public User updateProfile(Long userId, UserUpdateRequest updateRequest) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        
        if (!existingUser.getUsername().equals(updateRequest.getUsername())) {
            if (userRepository.existsByUsername(updateRequest.getUsername())) {
                throw new RuntimeException("Error: Username is already taken!");
            }
            existingUser.setUsername(updateRequest.getUsername());
        }

        if (!existingUser.getEmail().equals(updateRequest.getEmail())) {
            if (userRepository.existsByEmail(updateRequest.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }
            existingUser.setEmail(updateRequest.getEmail());
        }

       
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

       

        return userRepository.save(existingUser);
    }


  
  public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
                if (username == null) {
                    throw new UsernameNotFoundException("User Not Found with username: " + username);
                }
                return userRepository.findByUsername(username);
    }



}
