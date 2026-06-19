package lms.repository;

import java.util.List;
import lms.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByNameContaining(String name);

}