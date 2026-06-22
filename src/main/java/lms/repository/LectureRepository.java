package lms.repository;

import lms.model.Lecture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Integer> {

    Page<Lecture> findByCourseIdOrderByOrderNumber(Integer courseId, Pageable pageable);

    Page<Lecture> findByTitleContaining(String title, Pageable pageable);
}