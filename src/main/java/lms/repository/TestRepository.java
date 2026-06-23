package lms.repository;

import lms.model.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {

    @Query(value = "SELECT t.* FROM tests t "
            + "LEFT JOIN courses c ON t.course_id = c.id "
            + "WHERE (:title IS NULL OR CAST(t.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
            + "AND (:courseId IS NULL OR t.course_id = :courseId)",
            countQuery = "SELECT COUNT(*) FROM tests t "
                    + "WHERE (:title IS NULL OR "
                    + "CAST(t.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
                    + "AND (:courseId IS NULL OR t.course_id = :courseId)",
            nativeQuery = true)
    Page<Test> findByFilters(@Param("title") String title,
                             @Param("courseId") Integer courseId,
                             Pageable pageable);
}