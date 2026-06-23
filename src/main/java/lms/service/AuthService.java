package lms.service;

import lms.exception.AuthenticationException;
import lms.model.User;
import lms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String login, String password) {
        User user = userRepository.findByUsernameOrEmail(login)
                .orElseThrow(() -> new AuthenticationException("Пользователь не найден"));
        if (!user.getPassword().equals(password)) {
            throw new AuthenticationException("Неверный пароль");
        }
        return user;
    }
}