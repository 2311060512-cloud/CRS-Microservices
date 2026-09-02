package crs.registrationservice.Controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import crs.registrationservice.DTO.RegistrationRequestDTO;
import crs.registrationservice.Entity.Registration;
import crs.registrationservice.Service.RegistrationService;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping("/my")
    public List<Registration> getMyRegistrations(Authentication authentication) {
        Long studentId = (Long) authentication.getCredentials();
        return registrationService.getMyRegistrations(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration register(
            @Valid @RequestBody RegistrationRequestDTO dto
    ) {

        return registrationService.register(dto);
    }

    @DeleteMapping("/{id}")
    public void cancel(
            @PathVariable Long id
    ) {

        registrationService.cancel(id);
    }
}
