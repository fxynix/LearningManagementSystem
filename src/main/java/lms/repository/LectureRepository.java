package lms.repository;

import java.util.List;
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
            + "WHERE (:title IS NULL OR CAST(l.title AS TEXT) ILIKE "
            + "       CONCAT('%', CAST(:title AS TEXT), '%')) "
            + "AND (:courseId IS NULL OR l.course_id = :courseId) "
            + "AND ( "
            + "    (:isAdmin = TRUE) "
            + "    OR (:isTeacher = TRUE AND c.teacher_id = :userId) "
            + "    OR (EXISTS ( "
            + "          SELECT 1 FROM course_roles cr "
            + "          WHERE cr.course_id = l.course_id "
            + "          AND cr.role_id IN ( "
            + "              SELECT r.id FROM roles r WHERE r.name IN (:roles) "
            + "          ) "
            + "        ))"
            + ")",
            countQuery = "SELECT COUNT(*) FROM lectures l "
                    + "LEFT JOIN courses c ON l.course_id = c.id "
                    + "WHERE (:title IS NULL OR CAST(l.title AS TEXT) ILIKE "
                    + "       CONCAT('%', CAST(:title AS TEXT), '%')) "
                    + "AND (:courseId IS NULL OR l.course_id = :courseId) "
                    + "AND ( "
                    + "    (:isAdmin = TRUE) "
                    + "    OR (:isTeacher = TRUE AND c.teacher_id = :userId) "
                    + "    OR (EXISTS ( "
                    + "          SELECT 1 FROM course_roles cr "
                    + "          WHERE cr.course_id = l.course_id "
                    + "          AND cr.role_id IN ( "
                    + "              SELECT r.id FROM roles r WHERE r.name IN (:roles) "
                    + "          ) "
                    + "        ))"
                    + ")",
            nativeQuery = true)
    Page<Lecture> findLecturesByFiltersAndUser(@Param("title") String title,
                                               @Param("courseId") Integer courseId,
                                               @Param("isAdmin") boolean isAdmin,
                                               @Param("isTeacher") boolean isTeacher,
                                               @Param("userId") Integer userId,
                                               @Param("roles") List<String> roles,
                                               Pageable pageable);
}