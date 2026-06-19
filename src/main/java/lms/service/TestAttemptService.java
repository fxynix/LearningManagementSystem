package lms.service;

import java.util.List;
import lms.dto.create.TestAttemptCreateDto;
import lms.dto.update.TestAttemptUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Test;
import lms.model.TestAttempt;
import lms.model.User;
import lms.repository.TestAttemptRepository;
import lms.repository.TestRepository;
import lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TestAttemptService {

    private final TestAttemptRepository testAttemptRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;

    @Autowired
    public TestAttemptService(TestAttemptRepository testAttemptRepository,
                              TestRepository testRepository,
                              UserRepository userRepository) {
        this.testAttemptRepository = testAttemptRepository;
        this.testRepository = testRepository;
        this.userRepository = userRepository;
    }

    public List<TestAttempt> getAllTestAttempts() {
        return testAttemptRepository.findAll();
    }

    public TestAttempt getTestAttemptById(Integer id) {
        return testAttemptRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Попытка с ID " + id + " не найдена"));
    }

    public List<TestAttempt> getTestAttemptsByTest(Integer testId) {
        return testAttemptRepository.findByTestId(testId);
    }

    public List<TestAttempt> getTestAttemptsByUser(Integer userId) {
        return testAttemptRepository.findByUserId(userId);
    }

    public TestAttempt createTestAttempt(TestAttemptCreateDto dto) {
        Test test = testRepository.findById(dto.getTestId())
                .orElseThrow(() -> new NotFoundException("Тест с ID " + dto.getTestId()
                        + " не найден"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("Пользователь с ID "
                        + dto.getUserId() + " нe найден"));

        TestAttempt attempt = new TestAttempt();
        attempt.setTest(test);
        attempt.setUser(user);
        attempt.setAttemptNumber(dto.getAttemptNumber());
        attempt.setStartTime(dto.getStartTime());
        attempt.setEndTime(dto.getEndTime());
        attempt.setScore(dto.getScore());
        attempt.setStatus(dto.getStatus());

        return testAttemptRepository.save(attempt);
    }

    public TestAttempt updateTestAttempt(Integer id, TestAttemptUpdateDto dto) {
        TestAttempt attempt = getTestAttemptById(id);

        if (dto.getTestId() != null) {
            Test test = testRepository.findById(dto.getTestId())
                    .orElseThrow(() -> new NotFoundException("Тест с ID " + dto.getTestId()
                            + " не нaйден"));
            attempt.setTest(test);
        }
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new NotFoundException("Пользователь с ID "
                            + dto.getUserId() + " не найдeн"));
            attempt.setUser(user);
        }
        if (dto.getAttemptNumber() != null) {
            attempt.setAttemptNumber(dto.getAttemptNumber());
        }
        if (dto.getStartTime() != null) {
            attempt.setStartTime(dto.getStartTime());
        }
        if (dto.getEndTime() != null) {
            attempt.setEndTime(dto.getEndTime());
        }
        if (dto.getScore() != null) {
            attempt.setScore(dto.getScore());
        }
        if (dto.getStatus() != null) {
            attempt.setStatus(dto.getStatus());
        }

        return testAttemptRepository.save(attempt);
    }

    public void deleteTestAttempt(Integer id) {
        TestAttempt attempt = getTestAttemptById(id);
        testAttemptRepository.delete(attempt);
    }
}