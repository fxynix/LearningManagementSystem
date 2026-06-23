package lms.service;

import lms.exception.AuthenticationException;
import lms.model.User;
import lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String login, String password) {
        User user = userRepository.findByUsernameOrEmail(login)
                .orElseThrow(() -> new AuthenticationException("Пользователь не найден"));
        if (!user.getPassword().equals(password)) {
            throw new AuthenticationException("Неверный пароль");
        }
        return user;
    }
}