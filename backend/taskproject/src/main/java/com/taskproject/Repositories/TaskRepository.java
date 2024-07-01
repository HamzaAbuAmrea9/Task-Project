package com.taskproject.Repositories;





import org.springframework.data.jpa.repository.JpaRepository;
import com.taskproject.model.Tasks;
import com.taskproject.model.User;

import java.util.List;

public interface TaskRepository extends JpaRepository<Tasks, Long> {
    List<Tasks> findByUser(User user);
    Tasks findByIdAndUser(Long id, User user);
}

