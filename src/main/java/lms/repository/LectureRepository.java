package lms.repository;

import lms.model.Lecture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Integer> {

    @Query(value = "SELECT l.* FROM lectures l "
            + "LEFT JOIN courses c ON l.course_id = c.id "
            + "WHERE (:title IS NULL OR CAST(l.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
            + "AND (:courseId IS NULL OR l.course_id = :courseId)",
            countQuery = "SELECT COUNT(*) FROM lectures l "
                    + "WHERE (:title IS NULL OR "
                    + "CAST(l.title AS TEXT) ILIKE CONCAT('%', :title, '%')) "
                    + "AND (:courseId IS NULL OR l.course_id = :courseId)",
            nativeQuery = true)
    Page<Lecture> findByFilters(@Param("title") String title,
                                @Param("courseId") Integer courseId,
                                Pageable pageable);
}