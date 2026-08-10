package crs.registrationservice.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import crs.registrationservice.Client.CourseClient;
import crs.registrationservice.DTO.RegistrationRequestDTO;
import crs.registrationservice.Entity.Registration;
import crs.registrationservice.Repository.RegistrationRepository;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String DA_DANG_KY = "DA_DANG_KY";
    private static final String DA_HUY = "DA_HUY";

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public Registration register(
            RegistrationRequestDTO dto
    ) {

        // Kiểm tra sinh viên đã đăng ký chưa
        if (registrationRepository
                .existsByStudentIdAndCourseIdAndTrangThai(
                        dto.getStudentId(),
                        dto.getCourseId(),
                        DA_DANG_KY
                )) {

            throw new IllegalStateException(
                    "Sinh vien da dang ky mon hoc nay roi"
            );
        }

        // Bước 1:
        // Gọi course-service để trừ chỗ
        courseClient.reserveSeat(dto.getCourseId());

        // Bước 2:
        // Course-service xác nhận thành công
        // mới lưu Registration
        Registration registration =
                new Registration();

        registration.setStudentId(
                dto.getStudentId()
        );

        registration.setCourseId(
                dto.getCourseId()
        );

        registration.setTrangThai(
                DA_DANG_KY
        );

        registration.setNgayDangKy(
                LocalDateTime.now()
        );

        return registrationRepository.save(
                registration
        );
    }

    public void cancel(Long registrationId) {

        Registration registration =
                registrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Khong tim thay dang ky id = "
                                                + registrationId
                                )
                        );

        if (DA_HUY.equals(
                registration.getTrangThai()
        )) {

            throw new IllegalStateException(
                    "Dang ky nay da duoc huy truoc do"
            );
        }

        // Hoàn chỗ trước
        courseClient.releaseSeat(
                registration.getCourseId()
        );

        // Sau khi hoàn chỗ thành công
        // mới đổi trạng thái
        registration.setTrangThai(
                DA_HUY
        );

        registrationRepository.save(
                registration
        );
    }
}
