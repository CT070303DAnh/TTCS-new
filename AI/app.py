import sys
import os

import certifi
ca = certifi.where()

from dotenv import load_dotenv
load_dotenv()
mongo_db_url = os.getenv("MONGO_DB_URL")
print(mongo_db_url)


from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Request
from uvicorn import run as app_run
from fastapi.responses import Response
from starlette.responses import RedirectResponse
import pandas as pd

from medicprediction.ultils.ultils import load_object
from medicprediction.ultils.model.estimator import MedicModel


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

# from fastapi.templating import Jinja2Templates
# templates = Jinja2Templates(directory="./templates")

@app.get("/", tags=["authentication"])
async def index():
    return RedirectResponse(url="/docs")

# @app.get("/train")
# async def train_route():
#     try:
#         training_pipeline = TrainingPipeline()
#         training_pipeline.run_pipeline()
#         return Response("Training is succesful")
#     except Exception as e:
#         raise NetworkSecurityException(e, sys)
    
# @app.post("/predict")
# async def preditct_route(request:Request, file: UploadFile = File(...)):
#     try:
#         df = pd.read_csv(file.file)

#         preprocessor = load_object("final_model/preprocessor.pkl")
#         final_model = load_object("final_model/model.pkl")
#         network_model = NetworkModel(preprocessor=preprocessor, model=final_model)
#         print(df.iloc[0])
#         y_pred = network_model.predict(df)
#         print(y_pred)
#         df['predict_column'] = y_pred
#         df.to_csv("prediction_output/output.csv")
#         table_html = df.to_html(classes='table table-striped')
#         return templates.TemplateResponse("table.html", {"request": request, "table": table_html})
#     except Exception as e:
#         raise NetworkSecurityException(e, sys)
    
from pydantic import BaseModel
class URLFeatures(BaseModel):
    HighBP: int
    HighChol: int
    CholCheck: int
    BMI: float
    Smoker: int
    Stroke: int
    HeartDiseaseorAttack: int
    PhysActivity: int
    Fruits: int
    Veggies: int
    HvyAlcoholConsump: int
    AnyHealthcare: int
    NoDocbcCost: int
    GenHlth: int
    MentHlth: int
    PhysHlth: int
    DiffWalk: int
    Sex: int
    Age: int
    Education: int
    Income: int

@app.post("/predict_diabetes")
def predict(features: URLFeatures):
    # Chuyển dữ liệu thành DataFrame để model xử lý
    df = pd.DataFrame([features.dict()])

    # 🔹 Tải model và preprocessor
    preprocessor = load_object("final_model/diabetespreprocessor.pkl")
    final_model = load_object("final_model/diabetesbest_model.pkl")
    network_model = MedicModel(preprocessor=preprocessor, model=final_model)

    # 🔹 Dự đoán
    y_pred = network_model.predict(df)
    
    return {"prediction": int(y_pred[0])}
    
if __name__ == "__main__":
    app_run(app, host="localhost", port=8000)