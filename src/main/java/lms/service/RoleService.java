package lms.service;

import java.util.List;
import lms.dto.create.RoleCreateDto;
import lms.dto.update.RoleUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Role;
import lms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Роль с ID " + id + " не найдена"));
    }

    public List<Role> getRolesByName(String name) {
        List<Role> roles = roleRepository.findByNameContaining(name);
        if (roles.isEmpty()) {
            throw new NotFoundException("Роли с названием '" + name + "' не найдены");
        }
        return roles;
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