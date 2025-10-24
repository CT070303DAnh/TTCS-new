package com.medic.diagnosis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medic.diagnosis.dto.DiagnosisHistoryDTO;
import com.medic.diagnosis.dto.DiagnosisResponse;
import com.medic.diagnosis.entity.Diagnosis;
import com.medic.diagnosis.repository.DiagnosisRepository;
import com.medic.user.entity.User;
import com.medic.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisService {
    
    private final DiagnosisRepository diagnosisRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${app.pythonApi.baseUrl}")
    private String pythonApiBaseUrl;
    
    public DiagnosisResponse diagnose(String userEmail, Map<String, Object> payload) {
        try {
            // Call Python API
            String url = pythonApiBaseUrl + "/predict_diabetes";
            System.out.println("Calling Python API at: " + url);
            System.out.println("Payload: " + payload);
            
            Map response = restTemplate.postForObject(url, payload, Map.class);
            System.out.println("Python API Response: " + response);
            
            Integer prediction = ((Number) response.get("prediction")).intValue();
            
            // Save to database
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Diagnosis diagnosis = new Diagnosis();
            diagnosis.setUser(user);
            diagnosis.setPrediction(prediction);
            diagnosis.setInputJson(objectMapper.writeValueAsString(payload));
            
            diagnosisRepository.save(diagnosis);
            
            String message = prediction == 1 
                ? "Có nguy cơ tiểu đường. Vui lòng tham khảo bác sĩ."
                : "Không có nguy cơ tiểu đường. Hãy duy trì lối sống lành mạnh!";
            
            return new DiagnosisResponse(prediction, message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process diagnosis: " + e.getMessage(), e);
        }
    }
    
    public List<DiagnosisHistoryDTO> getHistory(String userEmail) {
        List<Diagnosis> diagnoses = diagnosisRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
        
        return diagnoses.stream().map(d -> {
            try {
                Map<String, Object> inputData = objectMapper.readValue(
                    d.getInputJson(), 
                    new TypeReference<Map<String, Object>>() {}
                );
                return new DiagnosisHistoryDTO(
                    d.getId(),
                    d.getPrediction(),
                    inputData,
                    d.getCreatedAt()
                );
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing diagnosis data", e);
            }
        }).collect(Collectors.toList());
    }
}

