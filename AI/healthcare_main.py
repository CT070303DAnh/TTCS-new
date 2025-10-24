from medicprediction.components.data_ingestion import DataIngestion
from medicprediction.components.data_transformation import DataTransformation
from medicprediction.components.model_trainer import ModelTrainer
from medicprediction.constanst import HEALTHCARE_DATA_FILE_PATH, HEALTHCARE_NAME_DIR, HEALTHCARE_TARGET_COLUMN
from medicprediction.entity.artifact_entity import DataIngestionArtifact, DataTransformationArtifact


if __name__ == "__main__":
    try:
        dataingestion = DataIngestion(HEALTHCARE_DATA_FILE_PATH, HEALTHCARE_NAME_DIR)
        dataingestionartifact = dataingestion.initiate_data_ingestion()
        print(dataingestionartifact)
        datatransformation = DataTransformation(dataingestionartifact, HEALTHCARE_NAME_DIR, HEALTHCARE_TARGET_COLUMN)
        datatransformationartifact = datatransformation.initiate_data_transformation()
        print(datatransformationartifact)
        modeltrainer = ModelTrainer(datatransformationartifact, HEALTHCARE_NAME_DIR)
        modeltrainerartifact = modeltrainer.initiate_model_trainer()
        print(modeltrainerartifact)
    except Exception as e:
        raise Exception(e)