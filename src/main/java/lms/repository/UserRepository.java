package lms.repository;

import java.util.List;
import lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findByUsernameContaining(String username);
}