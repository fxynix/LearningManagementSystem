package lms.service;

import java.util.List;
import lms.dto.create.LectureCreateDto;
import lms.dto.update.LectureUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Course;
import lms.model.Lecture;
import lms.repository.CourseRepository;
import lms.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LectureService {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public LectureService(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    public Lecture getLectureById(Integer id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Лекция с ID " + id + " не найдена"));
    }

    public Page<Lecture> getAllLectures(Pageable pageable) {
        return lectureRepository.findAll(pageable);
    }

    public Page<Lecture> getLecturesByTitle(String title, Pageable pageable) {
        return lectureRepository.findByTitleContaining(title, pageable);
    }

    public Page<Lecture> getLecturesByCourse(Integer courseId, Pageable pageable) {
        return lectureRepository.findByCourseIdOrderByOrderNumber(courseId, pageable);
    }

    public List<Lecture> getAllLecturesList() {
        return lectureRepository.findAll();
    }

    public Lecture createLecture(LectureCreateDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new NotFoundException("Курс с ID " + dto.getCourseId()
                        + " не найден"));

        Lecture lecture = new Lecture();
        lecture.setCourse(course);
        lecture.setTitle(dto.getTitle());
        lecture.setContent(dto.getContent());
        lecture.setOrderNumber(dto.getOrderNumber());

        return lectureRepository.save(lecture);
    }

    public Lecture updateLecture(Integer id, LectureUpdateDto dto) {
        Lecture lecture = getLectureById(id);

        if (dto.getCourseId() != null) {
            Course course = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new NotFoundException("Курс с ID " + dto.getCourseId()
                            + " не найден"));
            lecture.setCourse(course);
        }
        if (dto.getTitle() != null) {
            lecture.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            lecture.setContent(dto.getContent());
        }
        if (dto.getOrderNumber() != null) {
            lecture.setOrderNumber(dto.getOrderNumber());
        }

        return lectureRepository.save(lecture);
    }

    public void deleteLecture(Integer id) {
        Lecture lecture = getLectureById(id);
        lectureRepository.delete(lecture);
    }
}