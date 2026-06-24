package lms.service;

import java.util.List;
import lms.dto.create.RoleCreateDto;
import lms.dto.update.RoleUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Role;
import lms.model.User;
import lms.repository.RoleRepository;
import lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public Page<Role> getAllRoles(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    public Page<Role> getRolesByName(String name, Pageable pageable) {
        return roleRepository.findByNameContaining(name, pageable);
    }

    public List<User> getUsersByRole(Integer roleId) {
        return userRepository.findUsersByRoleId(roleId);
    }

    public List<Role> getAllRolesList() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Роль с ID " + id + " не найдена"));
    }

    public Role createRole(RoleCreateDto dto) {
        Role role = new Role();
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());
        return roleRepository.save(role);
    }

    public Role updateRole(Integer id, RoleUpdateDto dto) {
        Role role = getRoleById(id);
        if (dto.getName() != null) {
            role.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            role.setDescription(dto.getDescription());
        }
        return roleRepository.save(role);
    }

    public void deleteRole(Integer id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }
}