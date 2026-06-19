package lms.repository;

import java.util.List;
import lms.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {

    List<Test> findByCourseId(Integer courseId);
}