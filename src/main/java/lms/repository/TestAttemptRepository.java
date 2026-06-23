package lms.repository;

import lms.model.TestAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Integer> {

    @Query(value = "SELECT ta.* FROM test_attempts ta "
            + "LEFT JOIN tests t ON ta.test_id = t.id "
            + "LEFT JOIN users u ON ta.user_id = u.id "
            + "WHERE (:testId IS NULL OR ta.test_id = :testId) "
            + "AND (:userId IS NULL OR ta.user_id = :userId) "
            + "AND (:testTitle IS NULL OR "
            + "CAST(t.title AS TEXT) ILIKE CONCAT('%', :testTitle, '%')) "
            + "AND (:userUsername IS NULL OR "
            + "CAST(u.username AS TEXT) ILIKE CONCAT('%', :userUsername, '%'))",
            countQuery = "SELECT COUNT(*) FROM test_attempts ta "
                    + "LEFT JOIN tests t ON ta.test_id = t.id "
                    + "LEFT JOIN users u ON ta.user_id = u.id "
                    + "WHERE (:testId IS NULL OR ta.test_id = :testId) "
                    + "AND (:userId IS NULL OR ta.user_id = :userId) "
                    + "AND (:testTitle IS NULL OR "
                    + "CAST(t.title AS TEXT) ILIKE CONCAT('%', :testTitle, '%')) "
                    + "AND (:userUsername IS NULL OR "
                    + "CAST(u.username AS TEXT) ILIKE CONCAT('%', :userUsername, '%'))",
            nativeQuery = true)
    Page<TestAttempt> findByFilters(@Param("testId") Integer testId,
                                    @Param("userId") Integer userId,
                                    @Param("testTitle") String testTitle,
                                    @Param("userUsername") String userUsername,
                                    Pageable pageable);
}