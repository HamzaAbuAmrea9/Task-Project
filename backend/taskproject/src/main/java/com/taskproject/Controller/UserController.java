package com.taskproject.Controller;




import java.io.IOException;
import java.security.Principal;
import java.util.Base64;
import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.taskproject.Repositories.RoleRepository;
import com.taskproject.Repositories.UserRepository;
import com.taskproject.Services.UserService;
import com.taskproject.model.ERole;

import com.taskproject.model.Role;
import com.taskproject.model.SignupRequest;
import com.taskproject.model.User;
import com.taskproject.model.UserUpdateRequest;
import com.taskproject.security.JwtResponse;
import com.taskproject.security.JwtUtils;
import com.taskproject.security.MessageResponse;
import com.taskproject.security.UserDetailsImpl;
import com.taskproject.model.LoginRequest;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

 

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

     private final UserService userService;
     
        public UserController(UserService userService) {
            this.userService = userService;
        }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "admin":
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);

          break;
        case "mod":
          Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(modRole);

          break;
        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
  


 
  @PutMapping("/{id}/profile-image")
  public ResponseEntity<?> updateProfileImage(@PathVariable Long id, @RequestParam("image") MultipartFile image, Principal principal) {
      String username = principal.getName();
      User user = userRepository.findByUsername(username);

      if (user == null) {
          return new ResponseEntity<>("User must be authenticated to update profile image", HttpStatus.UNAUTHORIZED);
      }

      try {
          String imageUrl = null;
          if (image != null) {
              imageUrl = convertFileToBase64(image);
          }

          if (imageUrl == null) {
              return new ResponseEntity<>("Failed to process the image", HttpStatus.BAD_REQUEST);
          }

          user.setProfileImage(imageUrl);
          userRepository.save(user);

          return ResponseEntity.ok("Profile image updated successfully");
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile image");
      }
  }

  public String convertFileToBase64(MultipartFile file) {
      try {
          // Convert the file to a byte array
          byte[] bytes = file.getBytes();
          // Convert the byte array to a Base64 string
          String base64Image = Base64.getEncoder().encodeToString(bytes);
          // Return the Base64 string
          return base64Image;
      } catch (IOException e) {
          e.printStackTrace();
          // Handle the exception appropriately, such as logging an error or returning null
          return null;
      }
  }

    
  @GetMapping("/users")
    public List<User> getAllusers() {
        return userRepository.findAll();
    }

   
    
    
    
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable(value = "id") Long userId, @Valid @RequestBody UserUpdateRequest updateRequest) {
        User updatedUser = userService.updateProfile(userId, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
    
    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }
}

