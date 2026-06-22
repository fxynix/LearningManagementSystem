package lms.repository;

import lms.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    Page<Course> findByCategoryId(Integer categoryId, Pageable pageable);

    Page<Course> findByTeacherId(Integer teacherId, Pageable pageable);

    Page<Course> findByTitleContaining(String title, Pageable pageable);
}