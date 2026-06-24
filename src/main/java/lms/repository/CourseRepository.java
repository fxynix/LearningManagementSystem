package lms.repository;

import java.util.List;
import lms.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    @SuppressWarnings("squid:S107")
    @Query(value = "SELECT DISTINCT c.* FROM courses c "
            + "LEFT JOIN course_roles cr ON c.id = cr.course_id "
            + "LEFT JOIN roles r ON cr.role_id = r.id "
            + "WHERE (:title IS NULL OR CAST(c.title AS TEXT) ILIKE "
            + "       CONCAT('%', CAST(:title AS TEXT), '%')) "
            + "AND (:categoryId IS NULL OR c.category_id = :categoryId) "
            + "AND (:teacherId IS NULL OR c.teacher_id = :teacherId) "
            + "AND ( "
            + "    (:isAdmin = TRUE) "
            + "    OR (:isTeacher = TRUE AND c.teacher_id = :userId) "
            + "    OR (r.name IN (:roles)) "
            + ")",
            countQuery = "SELECT COUNT(DISTINCT c.id) FROM courses c "
                    + "LEFT JOIN course_roles cr ON c.id = cr.course_id "
                    + "LEFT JOIN roles r ON cr.role_id = r.id "
                    + "WHERE (:title IS NULL OR CAST(c.title AS TEXT) ILIKE "
                    + "       CONCAT('%', CAST(:title AS TEXT), '%')) "
                    + "AND (:categoryId IS NULL OR c.category_id = :categoryId) "
                    + "AND (:teacherId IS NULL OR c.teacher_id = :teacherId) "
                    + "AND ( "
                    + "    (:isAdmin = TRUE) "
                    + "    OR (:isTeacher = TRUE AND c.teacher_id = :userId) "
                    + "    OR (r.name IN (:roles)) "
                    + ")",
            nativeQuery = true)
    Page<Course> findCoursesByFiltersAndUser(@Param("title") String title,
                                             @Param("categoryId") Integer categoryId,
                                             @Param("teacherId") Integer teacherId,
                                             @Param("isAdmin") boolean isAdmin,
                                             @Param("isTeacher") boolean isTeacher,
                                             @Param("userId") Integer userId,
                                             @Param("roles") List<String> roles,
                                             Pageable pageable);
}