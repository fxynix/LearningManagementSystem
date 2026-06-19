package lms.repository;

import java.util.List;
import lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    List<Course> findByCategoryId(Integer categoryId);

    List<Course> findByTeacherId(Integer teacherId);
}