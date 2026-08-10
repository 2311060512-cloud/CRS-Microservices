package crs.course_service.Controller;

import crs.course_service.DTO.CourseDTO;
import crs.course_service.Service.CourseService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // ==================================================
    // SEARCH + PAGINATION
    // GET /courses
    // ==================================================

    @GetMapping("/courses")
    public Page<CourseDTO> search(
            @RequestParam(
                    required = false
            )
            String keyword,

            Pageable pageable
    ) {

        return courseService.search(
                keyword,
                pageable
        );
    }

    // ==================================================
    // GET BY ID
    // GET /courses/{id}
    // ==================================================

    @GetMapping("/courses/{id}")
    public CourseDTO getById(
            @PathVariable Long id
    ) {

        return courseService.getById(id);
    }

    // ==================================================
    // CREATE
    // POST /courses
    // ==================================================

    @PostMapping("/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO create(
            @Valid
            @RequestBody CourseDTO dto
    ) {

        return courseService.create(dto);
    }

    // ==================================================
    // UPDATE
    // PUT /courses/{id}
    // ==================================================

    @PutMapping("/courses/{id}")
    public CourseDTO update(
            @PathVariable Long id,

            @Valid
            @RequestBody CourseDTO dto
    ) {

        return courseService.update(
                id,
                dto
        );
    }

    // ==================================================
    // DELETE
    // DELETE /courses/{id}
    // ==================================================

    @DeleteMapping("/courses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {

        courseService.delete(id);
    }

    // ==================================================
    // INTERNAL - RESERVE SEAT
    // PATCH /internal/courses/{id}/reserve-seat
    // ==================================================

    @PatchMapping("/internal/courses/{id}/reserve-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reserveSeat(
            @PathVariable Long id
    ) {

        courseService.reserveSeat(id);
    }

    // ==================================================
    // INTERNAL - RELEASE SEAT
    // PATCH /internal/courses/{id}/release-seat
    // ==================================================

    @PatchMapping("/internal/courses/{id}/release-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void releaseSeat(
            @PathVariable Long id
    ) {

        courseService.releaseSeat(id);
    }
}