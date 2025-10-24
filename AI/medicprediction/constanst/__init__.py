import os
import numpy as np

TRAIN_FILE_NAME:str = "train.csv"
TEST_FILE_NAME:str = "test.csv"
TRANSFORMED_TRAIN_FILE_NAME: str = "train.npy"
TRANSFORMED_TEST_FILE_NAME: str = "test.npy"

DATA_DIR: str = "Medical_Data"

DATA_INGESTION_TRAIN_TEST_SPLIT_RATION:float = 0.3

DIABETES_DATA_FILE_NAME: str = "diabetes_data.csv"
DIABETES_DATA_FILE_PATH: str = os.path.join(DATA_DIR, DIABETES_DATA_FILE_NAME)
DIABETES_NAME_DIR: str = "diabetes"
DIABETES_TARGET_COLUMN: str = "Diabetes_012"

HEALTHCARE_DATA_FILE_NAME: str = "healthcare_dataset.csv"
HEALTHCARE_DATA_FILE_PATH: str = os.path.join(DATA_DIR, HEALTHCARE_DATA_FILE_NAME)
HEALTHCARE_NAME_DIR: str = "healthcare"
HEALTHCARE_TARGET_COLUMN: str = "Test Results"

DATA_STORE: str = "Data_Store"
TRANSFORM_STORE: str = "Transform_Store"

## kkn imputer to replace nan values
DATA_TRANSFORMATION_IMPUTER_PARAMS: dict = {
    "missing_values": np.nan,
    "n_neighbors": 3,
    "weights": "uniform",
}

