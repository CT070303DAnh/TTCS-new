from medicprediction.entity.artifact_entity import DataTransformationArtifact, ModelTrainerArtifact
from medicprediction.ultils.ultils import evaluate_models,save_object, load_numpy_array_data

from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.ensemble import (
    AdaBoostClassifier,
    GradientBoostingClassifier,
    RandomForestClassifier
)

class ModelTrainer:
    def __init__(self, data_transform_artifact:DataTransformationArtifact, name_dir: str):
        try:
            self.data_transform_artifact = data_transform_artifact
            self.name_dir = name_dir
        except Exception as e:
            raise Exception(e)
        
    def trainer_model(self, X_train, y_train, X_test, y_test):
        try:
            models = {
                "Decision Tree": DecisionTreeClassifier(),
                "Random Forest": RandomForestClassifier(verbose=1, n_jobs=-1),
                "Gradient Boosting": GradientBoostingClassifier(verbose=1),
                "Logistic Regression": LogisticRegression(verbose=1, n_jobs=-1),
                "AdaBoost": AdaBoostClassifier(),
            }
            params = {
                "Decision Tree": {
                'criterion': ['gini', 'entropy', 'log_loss'],
                # 'splitter': ['best', 'random'],
                # 'max_features': ['sqrt', 'log2']
                },
                "Random Forest": {
                    # 'criterion': ['gini', 'entropy', 'log_loss'],
                    # 'max_features': ['sqrt', 'log2', 'None'],
                    'n_estimators': [8, 16, 32, 64, 128, 256]
                },
                "Gradient Boosting": {
                    # 'loss': ['log_loss', 'exponential'],
                    'learning_rate': [.1,.01,.05,.001],
                    'subsample': [0.6, 0.7, 0.75, 0.8, 0.85, 0.9],
                    # 'criterion': ['squared_error', 'friedman_mse'],
                    # 'max_features': ['auto', 'sqrt', 'log2'],
                    'n_estimators': [8, 16, 32, 64, 128, 256]
                },
                "Logistic Regression": {},
                "AdaBoost": {
                    'learning_rate': [.1,.01,0.5,.001],
                    'n_estimators': [8, 16, 32, 64, 128, 256]
                }
            }

            model_report:dict = evaluate_models(X_train = X_train, y_train = y_train, X_test = X_test, y_test = y_test,
                                            models = models, param = params)
            
            best_model_score = max(sorted(model_report.values()))
            best_model_name = list(model_report.keys())[list(model_report.values()).index(best_model_score)]
            best_model = models[best_model_name]
            y_train_pred = best_model.predict(X_train)

            trained_model_file_path = "final_model/"+self.name_dir+"best_model.pkl"

            save_object(obj= best_model, file_path= trained_model_file_path)

            model_trainer_artifact =ModelTrainerArtifact(trained_model_file_path)
            return model_trainer_artifact

        except Exception as e:
            raise Exception(e)
        
    def initiate_model_trainer(self):
        try:
            train_file_path = self.data_transform_artifact.transformed_train_file_path
            test_file_path = self.data_transform_artifact.transformed_test_file_path

            train_arr = load_numpy_array_data(train_file_path)
            test_arr = load_numpy_array_data(test_file_path)

            X_train, y_train, X_test, y_test = (
                train_arr[:, :-1],
                train_arr[:, -1],
                test_arr[:, :-1],
                test_arr[:, -1]
            )
            model_trainer_artifact = self.trainer_model(X_train, y_train, X_test, y_test)
            return model_trainer_artifact
        except Exception as e:
            raise Exception(e)