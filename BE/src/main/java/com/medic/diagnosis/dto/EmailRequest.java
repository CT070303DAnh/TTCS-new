package com.medic.diagnosis.dto;
import java.util.Map;

public class EmailRequest {
    private String toEmail;
    private int prediction;
    private Map<String, Double> inputData; // Các chỉ số

    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public int getPrediction() { return prediction; }
    public void setPrediction(int prediction) { this.prediction = prediction; }
    public Map<String, Double> getInputData() { return inputData; }
    public void setInputData(Map<String, Double> inputData) { this.inputData = inputData; }
}
