package lms.repository;

import lms.model.TestAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Integer> {

    Page<TestAttempt> findByTestId(Integer testId, Pageable pageable);

    Page<TestAttempt> findByUserId(Integer userId, Pageable pageable);
}