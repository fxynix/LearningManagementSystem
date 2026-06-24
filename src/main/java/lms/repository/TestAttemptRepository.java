package lms.repository;

import java.util.List;
import lms.model.TestAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Integer> {

    @SuppressWarnings("squid:S107")
    @Query(value = "SELECT ta.* FROM test_attempts ta "
            + "LEFT JOIN tests t ON ta.test_id = t.id "
            + "LEFT JOIN courses c ON t.course_id = c.id "
            + "LEFT JOIN users u ON ta.user_id = u.id "
            + "WHERE (:testId IS NULL OR t.id = :testId) "
            + "AND (:userId IS NULL OR u.id = :userId) "
            + "AND (:testTitle IS NULL OR CAST(t.title AS TEXT) ILIKE "
            + "     CONCAT('%', CAST(:testTitle AS TEXT), '%')) "
            + "AND (:userUsername IS NULL OR CAST(u.username AS TEXT) ILIKE "
            + "     CONCAT('%', CAST(:userUsername AS TEXT), '%')) "
            + "AND ( "
            + "    (:isAdmin = TRUE) "
            + "    OR (:isTeacher = TRUE AND c.teacher_id = :currentUserId) "
            + "    OR (u.id = :currentUserId) "
            + ")",
            countQuery = "SELECT COUNT(*) FROM test_attempts ta "
                    + "LEFT JOIN tests t ON ta.test_id = t.id "
                    + "LEFT JOIN courses c ON t.course_id = c.id "
                    + "LEFT JOIN users u ON ta.user_id = u.id "
                    + "WHERE (:testId IS NULL OR t.id = :testId) "
                    + "AND (:userId IS NULL OR u.id = :userId) "
                    + "AND (:testTitle IS NULL OR CAST(t.title AS TEXT) ILIKE "
                    + "     CONCAT('%', CAST(:testTitle AS TEXT), '%')) "
                    + "AND (:userUsername IS NULL OR CAST(u.username AS TEXT) ILIKE "
                    + "     CONCAT('%', CAST(:userUsername AS TEXT), '%')) "
                    + "AND ( "
                    + "    (:isAdmin = TRUE) "
                    + "    OR (:isTeacher = TRUE AND c.teacher_id = :currentUserId) "
                    + "    OR (u.id = :currentUserId) "
                    + ")",
            nativeQuery = true)
    Page<TestAttempt> findAttemptsByFiltersAndUser(@Param("testId") Integer testId,
                                                   @Param("userId") Integer userId,
                                                   @Param("testTitle") String testTitle,
                                                   @Param("userUsername") String userUsername,
                                                   @Param("isAdmin") boolean isAdmin,
                                                   @Param("isTeacher") boolean isTeacher,
                                                   @Param("currentUserId") Integer currentUserId,
                                                   @Param("roles") List<String> roles,
                                                   Pageable pageable);
}