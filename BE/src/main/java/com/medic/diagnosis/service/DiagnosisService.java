package com.medic.diagnosis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medic.diagnosis.dto.DiagnosisHistoryDTO;
import com.medic.diagnosis.dto.DiagnosisRequest; // Import DTO mới
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

    // CẬP NHẬT 1: Nhận DiagnosisRequest thay vì Map
    public DiagnosisResponse diagnose(String userEmail, DiagnosisRequest request) {
        Integer prediction = 0;
        String source = "AI_PYTHON";

        try {
            // 1. Cố gắng gọi API Python
            String url = pythonApiBaseUrl + "/predict_diabetes";
            System.out.println("Calling Python API at: " + url);

            // Log dữ liệu gửi đi để debug
            System.out.println("Payload sent to Python: " + objectMapper.writeValueAsString(request));

            Map response = restTemplate.postForObject(url, request, Map.class);

            if (response != null && response.get("prediction") != null) {
                prediction = ((Number) response.get("prediction")).intValue();
                System.out.println("Python API Response Prediction: " + prediction);
            } else {
                throw new RuntimeException("Python API returned empty response");
            }

        } catch (Exception e) {
            // 2. CƠ CHẾ DỰ PHÒNG (FALLBACK): Nếu Python lỗi, tính bằng Java
            System.err.println("⚠️ Lỗi gọi Python API: " + e.getMessage());
            System.out.println("🔄 Đang chuyển sang thuật toán Java dự phòng (Rule-based)...");

            prediction = calculateRiskJava(request);
            source = "JAVA_FALLBACK";
        }

        // 3. Lưu kết quả vào Database
        saveDiagnosisResult(userEmail, request, prediction, source);

        // 4. Tạo thông báo trả về
        String message = prediction == 1
                ? "Cảnh báo: Có nguy cơ tiểu đường (Nguồn: " + source + "). Vui lòng đi khám."
                : "An toàn: Các chỉ số ổn định (Nguồn: " + source + "). Hãy duy trì lối sống lành mạnh!";

        return new DiagnosisResponse(prediction, message);
    }

    // CẬP NHẬT 2: Hàm tính toán dự phòng bằng Java (Logic BRFSS 21 trường)
    private Integer calculateRiskJava(DiagnosisRequest r) {
        int score = 0;

        // Huyết áp cao (+2 điểm)
        if (r.getHighBP() != null && r.getHighBP() == 1) score += 2;

        // Cholesterol cao (+2 điểm)
        if (r.getHighChol() != null && r.getHighChol() == 1) score += 2;

        // BMI: Béo phì >= 30 (+2 điểm), Thừa cân >= 25 (+1 điểm)
        if (r.getBmi() != null) {
            if (r.getBmi() >= 30) score += 2;
            else if (r.getBmi() >= 25) score += 1;
        }

        // Tuổi cao (Nhóm 9 trở lên ~ 60 tuổi) (+1 điểm)
        if (r.getAge() != null && r.getAge() >= 9) score += 1;

        // Sức khỏe tổng quát kém (Mức 4 hoặc 5) (+1 điểm)
        if (r.getGenHlth() != null && r.getGenHlth() >= 4) score += 1;

        // Khó khăn đi lại (+1 điểm)
        if (r.getDiffWalk() != null && r.getDiffWalk() == 1) score += 1;

        // Nếu tổng điểm >= 5 thì dự đoán có nguy cơ (1), ngược lại là 0
        return score >= 5 ? 1 : 0;
    }

    // CẬP NHẬT 3: Hàm lưu Database nhận DTO
    private void saveDiagnosisResult(String email, DiagnosisRequest request, Integer prediction, String source) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Diagnosis diagnosis = new Diagnosis();
            diagnosis.setUser(user);
            diagnosis.setPrediction(prediction);
            // Chuyển DTO thành JSON String để lưu vào DB
            diagnosis.setInputJson(objectMapper.writeValueAsString(request));

            diagnosisRepository.save(diagnosis);
        } catch (Exception e) {
            System.err.println("Failed to save diagnosis history: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Hàm lấy lịch sử (Giữ nguyên logic nhưng thêm try-catch an toàn hơn)
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
                        System.err.println("Error parsing history JSON for ID " + d.getId());
                        return null; // Bỏ qua bản ghi lỗi
                    }
                })
                .filter(item -> item != null) // Lọc bỏ các item null
                .collect(Collectors.toList());
    }
}