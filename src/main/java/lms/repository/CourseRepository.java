package lms.repository;

import lms.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query(value = "SELECT c.* FROM courses c "
            + "LEFT JOIN categories cat ON c.category_id = cat.id "
            + "LEFT JOIN users u ON c.teacher_id = u.id "
            + "WHERE (:title IS NULL OR CAST(c.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
            + "AND (:categoryId IS NULL OR c.category_id = :categoryId) "
            + "AND (:teacherId IS NULL OR c.teacher_id = :teacherId)",
            countQuery = "SELECT COUNT(*) FROM courses c "
                    + "WHERE (:title IS NULL OR "
                    + "CAST(c.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
                    + "AND (:categoryId IS NULL OR c.category_id = :categoryId) "
                    + "AND (:teacherId IS NULL OR c.teacher_id = :teacherId)",
            nativeQuery = true)
    Page<Course> findByFilters(@Param("title") String title,
                               @Param("categoryId") Integer categoryId,
                               @Param("teacherId") Integer teacherId,
                               Pageable pageable);
}