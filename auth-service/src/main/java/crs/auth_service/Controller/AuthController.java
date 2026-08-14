package crs.auth_service.Controller;

import crs.auth_service.DTO.LoginRequestDTO;
import crs.auth_service.DTO.LoginResponseDTO;
import crs.auth_service.Service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO dto
    ) {

        return authService.login(dto);
    }
}