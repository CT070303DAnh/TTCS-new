from medicprediction.components.data_ingestion import DataIngestion
from medicprediction.components.data_transformation import DataTransformation
from medicprediction.components.model_trainer import ModelTrainer
from medicprediction.constanst import DIABETES_DATA_FILE_PATH, DIABETES_NAME_DIR, DIABETES_TARGET_COLUMN
from medicprediction.entity.artifact_entity import DataIngestionArtifact, DataTransformationArtifact


if __name__ == "__main__":
    try:
        dataingestion = DataIngestion(DIABETES_DATA_FILE_PATH, DIABETES_NAME_DIR)
        dataingestionartifact = dataingestion.initiate_data_ingestion()
        print(dataingestionartifact)
        datatransformation = DataTransformation(dataingestionartifact, DIABETES_NAME_DIR, DIABETES_TARGET_COLUMN)
        datatransformationartifact = datatransformation.initiate_data_transformation()
        print(datatransformationartifact)
        modeltrainer = ModelTrainer(datatransformationartifact, DIABETES_NAME_DIR)
        modeltrainerartifact = modeltrainer.initiate_model_trainer()
        print(modeltrainerartifact)
    except Exception as e:
        raise Exception(e)