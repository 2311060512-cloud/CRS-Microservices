package crs.course_service.Service;


import crs.course_service.DTO.CourseDTO;
import crs.course_service.Entity.Course;
import crs.course_service.Repository.CourseRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor

public class CourseService {



    private final CourseRepository courseRepository;



    public List<CourseDTO> getAll(){


        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }





    public CourseDTO getById(Long id){


        Course course =
                courseRepository.findById(id)
                        .orElseThrow(
                                () -> new NoSuchElementException(
                                        "Không tìm thấy môn học id = " + id
                                )
                        );


        return convertToDTO(course);

    }





    public CourseDTO create(CourseDTO dto){



        if(courseRepository
                .existsByTenMonHocIgnoreCase(dto.getTenMonHoc())){


            throw new IllegalArgumentException(
                    "Tên môn học đã tồn tại"
            );

        }




        Course course = new Course();


        course.setTenMonHoc(dto.getTenMonHoc());

        course.setSoTinChi(dto.getSoTinChi());

        course.setSoChoToiDa(dto.getSoChoToiDa());



        // Khi tạo mới:
        // số chỗ còn lại = số chỗ tối đa

        course.setSoChoConLai(
                dto.getSoChoToiDa()
        );



        return convertToDTO(
                courseRepository.save(course)
        );

    }







    public CourseDTO update(Long id, CourseDTO dto){



        Course course =
                courseRepository.findById(id)

                        .orElseThrow(
                                () -> new NoSuchElementException(
                                        "Không tìm thấy môn học id = " + id
                                )
                        );



        course.setTenMonHoc(dto.getTenMonHoc());

        course.setSoTinChi(dto.getSoTinChi());

        course.setSoChoToiDa(dto.getSoChoToiDa());



        // Không cập nhật soChoConLai


        return convertToDTO(
                courseRepository.save(course)
        );


    }







    public void delete(Long id){



        if(!courseRepository.existsById(id)){


            throw new NoSuchElementException(
                    "Không tìm thấy môn học id = " + id
            );

        }



        courseRepository.deleteById(id);


    }







    private CourseDTO convertToDTO(Course course){



        return new CourseDTO(

                course.getId(),

                course.getTenMonHoc(),

                course.getSoTinChi(),

                course.getSoChoToiDa(),

                course.getSoChoConLai()

        );


    }


}