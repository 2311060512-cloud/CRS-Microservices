package crs.auth_service.Service;

import crs.auth_service.DTO.LoginRequestDTO;
import crs.auth_service.DTO.LoginResponseDTO;
import crs.auth_service.Entity.User;
import crs.auth_service.Exception.InvalidCredentialsException;
import crs.auth_service.Repository.UserRepository;
import crs.auth_service.Security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(
            LoginRequestDTO dto
    ) {

        User user = userRepository
                .findByUsername(dto.getUsername())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Sai username hoac password"
                        )
                );

        if (!passwordEncoder.matches(
                dto.getPassword(),
                user.getPassword()
        )) {

            throw new InvalidCredentialsException(
                    "Sai username hoac password"
            );
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return new LoginResponseDTO(
                token,
                user.getUsername(),
                user.getRole()
        );
    }
}