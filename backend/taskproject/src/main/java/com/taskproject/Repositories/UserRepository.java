package com.taskproject.Repositories;




import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taskproject.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

  
  
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
