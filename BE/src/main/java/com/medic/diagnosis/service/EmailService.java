package com.medic.diagnosis.service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResultEmail(String toEmail, int prediction, Map<String, Double> data) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("Diabetes Care System <support@diabetescare.com>");
        helper.setTo(toEmail);
        helper.setSubject("Kết quả Chẩn đoán Sức khỏe - Diabetes Care");

        String resultText = (prediction == 1)
                ? "<h2 style='color: #dc2626;'>CÓ NGUY CƠ TIỂU ĐƯỜNG</h2><p>Hệ thống nhận thấy các chỉ số của bạn có dấu hiệu rủi ro.</p>"
                : "<h2 style='color: #16a34a;'>KHÔNG CÓ NGUY CƠ</h2><p>Chúc mừng! Các chỉ số của bạn ở mức an toàn.</p>";

        StringBuilder details = new StringBuilder();
        details.append("<ul>");
        details.append("<li><b>BMI:</b> ").append(data.get("BMI")).append("</li>");
        details.append("<li><b>Huyết áp cao:</b> ").append(data.get("HighBP") == 1 ? "Có" : "Không").append("</li>");
        details.append("</ul>");

        String htmlContent = """
            <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                    <div style='text-align: center; border-bottom: 2px solid #0479B6; padding-bottom: 10px;'>
                        <h1 style='color: #0479B6;'>Diabetes Care</h1>
                    </div>
                    <div style='padding: 20px 0;'>
                        <p>Xin chào,</p>
                        <p>Dưới đây là kết quả phân tích sức khỏe mới nhất của bạn:</p>
                        <div style='background-color: #f9fafb; padding: 15px; border-radius: 8px; text-align: center;'>
                            %s
                        </div>
                        <h3>Chi tiết chỉ số chính:</h3>
                        %s
                        <p><i>Lưu ý: Kết quả này chỉ mang tính tham khảo. Vui lòng đến cơ sở y tế để được khám chi tiết.</i></p>
                    </div>
                    <div style='text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;'>
                        &copy; 2025 Diabetes Care Team.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resultText, details.toString());

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
