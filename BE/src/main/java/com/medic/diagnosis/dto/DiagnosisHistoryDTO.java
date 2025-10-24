package com.medic.diagnosis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosisHistoryDTO {
    private Long id;
    private Integer prediction;
    private Map<String, Object> inputData;
    private LocalDateTime createdAt;
}

