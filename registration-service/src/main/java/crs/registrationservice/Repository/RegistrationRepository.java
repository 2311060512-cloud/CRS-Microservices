package crs.registrationservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import crs.registrationservice.Entity.Registration;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentId(Long studentId);

    boolean existsByStudentIdAndCourseIdAndTrangThai(
            Long studentId,
            Long courseId,
            String trangThai
    );
}