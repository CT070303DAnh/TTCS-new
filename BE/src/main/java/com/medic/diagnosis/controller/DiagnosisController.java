package com.medic.diagnosis.controller;

import com.medic.diagnosis.dto.DiagnosisHistoryDTO;
import com.medic.diagnosis.dto.DiagnosisResponse;
import com.medic.diagnosis.service.DiagnosisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {
    
    private final DiagnosisService diagnosisService;
    
    @PostMapping
    public ResponseEntity<?> diagnose(Authentication auth, @RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Diagnosis request from: " + auth.getName());
            System.out.println("Payload received: " + payload);
            
            DiagnosisResponse response = diagnosisService.diagnose(auth.getName(), payload);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in diagnosis: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<DiagnosisHistoryDTO>> getHistory(Authentication auth) {
        List<DiagnosisHistoryDTO> history = diagnosisService.getHistory(auth.getName());
        return ResponseEntity.ok(history);
    }
}

