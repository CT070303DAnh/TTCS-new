package com.medic.diagnosis.controller;

import com.medic.diagnosis.dto.EmailRequest;
import com.medic.diagnosis.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest req) {
        try {
            emailService.sendResultEmail(req.getToEmail(), req.getPrediction(), req.getInputData());
            return ResponseEntity.ok().body("{\"message\": \"Đã gửi email thành công!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"message\": \"Lỗi gửi mail: " + e.getMessage() + "\"}");
        }
    }
}
