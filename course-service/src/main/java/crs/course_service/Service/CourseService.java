package crs.course_service.Service;

import crs.course_service.DTO.CourseDTO;
import crs.course_service.Entity.Course;
import crs.course_service.Repository.CourseRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // ==================================================
    // BUỔI 2 - GET ALL
    // ==================================================

    public List<CourseDTO> getAll() {

        return courseRepository
                .findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ==================================================
    // BUỔI 3 - SEARCH + PAGINATION
    // ==================================================

    public Page<CourseDTO> search(
            String keyword,
            Pageable pageable
    ) {

        Page<Course> page;

        if (
                keyword == null
                        || keyword.isBlank()
        ) {

            page = courseRepository
                    .findAll(pageable);

        } else {

            page = courseRepository
                    .findByTenMonHocContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        return page.map(this::toDTO);
    }

    // ==================================================
    // GET BY ID
    // ==================================================

    public CourseDTO getById(Long id) {

        Course course = courseRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + id
                        )
                );

        return toDTO(course);
    }

    // ==================================================
    // CREATE
    // ==================================================

    public CourseDTO create(
            CourseDTO dto
    ) {

        if (
                courseRepository
                        .existsByTenMonHocIgnoreCase(
                                dto.getTenMonHoc()
                        )
        ) {

            throw new IllegalArgumentException(
                    "Ten mon hoc da ton tai"
            );
        }

        Course course = new Course();

        course.setTenMonHoc(
                dto.getTenMonHoc()
        );

        course.setSoTinChi(
                dto.getSoTinChi()
        );

        course.setSoChoToiDa(
                dto.getSoChoToiDa()
        );

        // Khi tạo môn học:
        // số chỗ còn lại = số chỗ tối đa

        course.setSoChoConLai(
                dto.getSoChoToiDa()
        );

        return toDTO(
                courseRepository.save(course)
        );
    }

    // ==================================================
    // UPDATE
    // ==================================================

    public CourseDTO update(
            Long id,
            CourseDTO dto
    ) {

        Course course = courseRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + id
                        )
                );

        course.setTenMonHoc(
                dto.getTenMonHoc()
        );

        course.setSoTinChi(
                dto.getSoTinChi()
        );

        course.setSoChoToiDa(
                dto.getSoChoToiDa()
        );

        // Không sửa soChoConLai ở đây.

        return toDTO(
                courseRepository.save(course)
        );
    }

    // ==================================================
    // DELETE
    // ==================================================

    public void delete(Long id) {

        if (
                !courseRepository.existsById(id)
        ) {

            throw new NoSuchElementException(
                    "Khong tim thay mon hoc id = "
                            + id
            );
        }

        courseRepository.deleteById(id);
    }

    // ==================================================
    // BUỔI 3 - RESERVE SEAT
    // ==================================================

    @Transactional
    public CourseDTO reserveSeat(
            Long courseId
    ) {

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + courseId
                        )
                );

        if (
                course.getSoChoConLai() <= 0
        ) {

            throw new IllegalStateException(
                    "Mon hoc da het cho, khong the dang ky"
            );
        }

        course.setSoChoConLai(
                course.getSoChoConLai() - 1
        );

        return toDTO(
                courseRepository.save(course)
        );
    }

    // ==================================================
    // BUỔI 3 - RELEASE SEAT
    // ==================================================

    @Transactional
    public CourseDTO releaseSeat(
            Long courseId
    ) {

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + courseId
                        )
                );

        if (
                course.getSoChoConLai()
                        < course.getSoChoToiDa()
        ) {

            course.setSoChoConLai(
                    course.getSoChoConLai() + 1
            );
        }

        return toDTO(
                courseRepository.save(course)
        );
    }



    private CourseDTO toDTO(
            Course course
    ) {

        return new CourseDTO(
                course.getId(),
                course.getTenMonHoc(),
                course.getSoTinChi(),
                course.getSoChoToiDa(),
                course.getSoChoConLai()
        );
    }
}