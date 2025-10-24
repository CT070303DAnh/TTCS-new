import pandas as pd
from sklearn.model_selection import train_test_split
import os

from medicprediction.entity.artifact_entity import DataIngestionArtifact

from medicprediction.constanst import DATA_INGESTION_TRAIN_TEST_SPLIT_RATION, DATA_STORE, TRAIN_FILE_NAME, TEST_FILE_NAME

class DataIngestion:
    def __init__(self, path:str, name_dir: str):
        self.path = path
        self.name_dir = name_dir
    
    def initiate_data_ingestion(self):
        try:
            df = pd.read_csv(self.path)
            data_dir = os.path.join(os.getcwd(), DATA_STORE, self.name_dir)
            os.makedirs(data_dir, exist_ok=True)
            train_path = os.path.join(data_dir, TRAIN_FILE_NAME)
            test_path = os.path.join(data_dir, TEST_FILE_NAME)
            self.split_data_as_train_test(df, train_path, test_path)
            dataingestionartifact = DataIngestionArtifact(train_path, test_path)
            return dataingestionartifact
        except Exception as e:
            raise Exception(e)
        
    def split_data_as_train_test(self, dataframe: pd.DataFrame, train_file_path: str, test_file_path: str):
        try:
            train_set, test_set = train_test_split(dataframe, test_size=DATA_INGESTION_TRAIN_TEST_SPLIT_RATION)
            data_dir = os.path.join(os.getcwd(), DATA_STORE, self.name_dir)
            train_set.to_csv(train_file_path, index = False, header = True)
            test_set.to_csv(test_file_path, index = False, header = True)
        except Exception as e:
            raise Exception(e)
        
if __name__ == "__main__":
        test = DataIngestion("Medical_Data\diabetes_data.csv", "diabetes")
        test.initiate_data_ingestion()