from fastapi import FastAPI
import uvicorn
import get_places
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/places")
def tokenize(lon: float, lat: float, user_description: str):
    return get_places.get_places(lon, lat, user_description)


if __name__ == '__main__':
    uvicorn.run(app, port=443, host='0.0.0.0', ssl_keyfile='key.pem', ssl_certfile='cert.pem')
