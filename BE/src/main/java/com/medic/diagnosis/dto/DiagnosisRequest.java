package com.medic.diagnosis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DiagnosisRequest {
    @JsonProperty("HighBP")
    private Integer highBP;

    @JsonProperty("HighChol")
    private Integer highChol;

    @JsonProperty("CholCheck")
    private Integer cholCheck;

    @JsonProperty("BMI")
    private Double bmi;

    @JsonProperty("Smoker")
    private Integer smoker;

    @JsonProperty("Stroke")
    private Integer stroke;

    @JsonProperty("HeartDiseaseorAttack")
    private Integer heartDiseaseorAttack;

    @JsonProperty("PhysActivity")
    private Integer physActivity;

    @JsonProperty("Fruits")
    private Integer fruits;

    @JsonProperty("Veggies")
    private Integer veggies;

    @JsonProperty("HvyAlcoholConsump")
    private Integer hvyAlcoholConsump;

    @JsonProperty("AnyHealthcare")
    private Integer anyHealthcare;

    @JsonProperty("NoDocbcCost")
    private Integer noDocbcCost;

    @JsonProperty("GenHlth")
    private Integer genHlth;

    @JsonProperty("MentHlth")
    private Integer mentHlth;

    @JsonProperty("PhysHlth")
    private Integer physHlth;

    @JsonProperty("DiffWalk")
    private Integer diffWalk;

    @JsonProperty("Sex")
    private Integer sex;

    @JsonProperty("Age")
    private Integer age;

    @JsonProperty("Education")
    private Integer education;

    @JsonProperty("Income")
    private Integer income;
}