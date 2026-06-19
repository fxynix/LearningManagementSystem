package lms.repository;

import java.util.List;
import lms.model.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Integer> {

    List<TestAttempt> findByTestId(Integer testId);

    List<TestAttempt> findByUserId(Integer userId);
}