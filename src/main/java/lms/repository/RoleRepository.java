package lms.repository;

import java.util.List;
import lms.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    List<Role> findByNameContaining(String name);
}