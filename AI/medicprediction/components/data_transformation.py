from medicprediction.entity.artifact_entity import DataIngestionArtifact
from medicprediction.constanst import DATA_TRANSFORMATION_IMPUTER_PARAMS, TRANSFORM_STORE, TRANSFORMED_TEST_FILE_NAME, TRANSFORMED_TRAIN_FILE_NAME
from medicprediction.entity.artifact_entity import DataTransformationArtifact
from sklearn.impute import KNNImputer
from sklearn.pipeline import Pipeline
import numpy as np
from medicprediction.ultils.ultils import save_numpy_array_data, save_object
import os

import pandas as pd

class DataTransformation():
    def __init__(self, dataingestionartifact: DataIngestionArtifact, name_dir:str, target_column: str):
        self.dataingestionartifact = dataingestionartifact
        self.name_dir = name_dir
        self.target_column = target_column

    def get_data_transfomer_object(cls) -> Pipeline:
        try:
            imputer: KNNImputer = KNNImputer(**DATA_TRANSFORMATION_IMPUTER_PARAMS)
            processor: Pipeline = Pipeline([("imputer", imputer)])
            return processor
        except Exception as e:
            raise Exception(e)

    @staticmethod
    def read_data(file_path: str) -> pd.DataFrame:
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            raise Exception(e)

    def initiate_data_transformation(self) -> DataTransformationArtifact:
        try:
            train_df: pd.DataFrame = DataTransformation.read_data(self.dataingestionartifact.trained_file_path)
            test_df: pd.DataFrame = DataTransformation.read_data(self.dataingestionartifact.test_file_path)
            
            #training dataframe
            input_feature_train_df = train_df.drop(columns=[self.target_column], axis=1)
            target_feature_train_df = train_df[self.target_column]

            #testing dataframe
            input_feature_test_df = test_df.drop(columns=[self.target_column], axis=1)
            target_feature_test_df = test_df[self.target_column]

            preprocessor = self.get_data_transfomer_object()

            preprocessor_obj = preprocessor.fit(input_feature_train_df)
            transformed_input_train_feature = preprocessor_obj.transform(input_feature_train_df)
            transformed_input_test_feature = preprocessor_obj.transform(input_feature_test_df)

            train_arr = np.c_[(transformed_input_train_feature, np.array(target_feature_train_df))]
            test_arr = np.c_[(transformed_input_test_feature, np.array(target_feature_test_df))]

            #save
            os.makedirs(TRANSFORM_STORE, exist_ok=True)
            save_train_array_data_path = os.path.join(TRANSFORM_STORE, TRANSFORMED_TRAIN_FILE_NAME)
            save_test_array_data_path = os.path.join(TRANSFORM_STORE, TRANSFORMED_TEST_FILE_NAME)
            save_preprocessor_path = "final_model/"+self.name_dir+"preprocessor.pkl"
            save_numpy_array_data(save_train_array_data_path, train_arr)
            save_numpy_array_data(save_test_array_data_path, test_arr)
            save_object(save_preprocessor_path, preprocessor_obj)

            data_transformation_artifact = DataTransformationArtifact(
                transformed_object_file_path=save_preprocessor_path,
                transformed_train_file_path=save_train_array_data_path,
                transformed_test_file_path=save_test_array_data_path
            )

            return data_transformation_artifact

        except Exception as e:
            raise Exception(e)