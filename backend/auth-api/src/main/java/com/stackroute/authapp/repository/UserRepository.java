package com.stackroute.authapp.repository;

import com.stackroute.authapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // Find a user by email and password for authentication
    User findByEmailAndPassword(String email, String password);

    // Better and safer: return Optional for null safety
    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE user", nativeQuery = true)
    void truncateUserTable();

}
