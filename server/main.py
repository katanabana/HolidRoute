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
    allow_origins=[os.getenv('FRONTEND_URL')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "connected to api successfully"}


@app.get("/places")
async def tokenize(lon: float, lat: float, user_description: str):
    return await get_places.get_places(lon, lat, user_description)


def main():
    if os.path.isfile(os.getenv("SSL_KEY")) and os.path.isfile(os.getenv("SSL_CERT")):
        uvicorn.run(
            app,
            port=int(os.getenv('PORT')),
            host=os.getenv('HOST'),
            ssl_keyfile=os.getenv("SSL_KEY"),
            ssl_certfile=os.getenv("SSL_CERT")
        )

    else:
        uvicorn.run(
            app,
            port=int(os.getenv('PORT')),
            host=os.getenv('HOST'),
        )


if __name__ == '__main__':
    main()
