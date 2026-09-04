package crs.auth_service.Controller;

import crs.auth_service.DTO.ApiKeyCreateRequestDTO;
import crs.auth_service.DTO.ApiKeyResponseDTO;
import crs.auth_service.Service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping
    public List<ApiKeyResponseDTO> getAll() {
        return apiKeyService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiKeyResponseDTO create(@Valid @RequestBody ApiKeyCreateRequestDTO dto) {
        return apiKeyService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void revoke(@PathVariable Long id) {
        apiKeyService.revoke(id);
    }
}
