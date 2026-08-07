package crs.course_service.Repository;


import crs.course_service.Entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;



public interface CourseRepository
        extends JpaRepository<Course, Long> {


    boolean existsByTenMonHocIgnoreCase(String tenMonHoc);


}