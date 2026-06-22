package lms.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lms.dto.create.UserCreateDto;
import lms.dto.update.UserUpdateDto;
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
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с ID " + id + " не найден"));
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> getUsersByUsername(String username, Pageable pageable) {
        return userRepository.findByUsernameContaining(username, pageable);
    }

    public List<User> getAllUsersList() {
        return userRepository.findAll();
    }

    public User createUser(UserCreateDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFullName(dto.getFullName());

        if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
            Set<Role> roles = dto.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new NotFoundException("Роль с ID " + roleId
                                    + " не найдена")))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    public User updateUser(Integer id, UserUpdateDto dto) {
        User user = getUserById(id);

        if (dto.getUsername() != null) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPassword() != null) {
            user.setPassword(dto.getPassword());
        }
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }

        if (dto.getRoleIds() != null) {
            Set<Role> roles = dto.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new NotFoundException("Рoль с ID " + roleId
                                    + " нe найдена")))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}