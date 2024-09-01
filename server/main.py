import os

from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn
import get_places
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

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
    uvicorn.run(
        app,
        port=int(os.getenv('port')),
        host=os.getenv('host'),
        ssl_keyfile=os.getenv("ssl_key"),
        ssl_certfile=os.getenv("ssl_cert")
    )
