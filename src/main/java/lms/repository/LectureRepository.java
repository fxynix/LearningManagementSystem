package lms.repository;

import java.util.List;
import lms.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LectureRepository extends JpaRepository<Lecture, Integer> {

    List<Lecture> findByCourseIdOrderByOrderNumber(Integer courseId);
}