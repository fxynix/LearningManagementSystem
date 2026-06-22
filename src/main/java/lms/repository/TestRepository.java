package lms.repository;

import lms.model.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {

    Page<Test> findByCourseId(Integer courseId, Pageable pageable);

    Page<Test> findByTitleContaining(String title, Pageable pageable);
}