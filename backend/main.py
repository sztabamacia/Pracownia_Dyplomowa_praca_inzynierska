from fastapi import FastAPI
from containers import Container
from Users import routes as routes_users
from Mushrooms import routes as routes_mushrooms
from History import routes as routes_history
from Predictions import routes as routes_predictions
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from customError import CustomError
from fastapi.staticfiles import StaticFiles
import auth_routes
load_dotenv()

container = Container()

db_url = os.getenv("DATABASE_URL")
if db_url is None:
    raise ValueError("DATABASE_URL is not defined in .env file.")

db = container.db()
db.create_database()
app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.exception_handler(CustomError)
async def unicorn_exception_handler(request, exc: CustomError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message},
    )

app.container = container
app.include_router(routes_users.router, prefix="/users")
app.include_router(routes_mushrooms.router, prefix="/mushrooms")
app.include_router(routes_history.router, prefix="/history")
app.include_router(routes_predictions.router, prefix="/predictions")
app.include_router(auth_routes.router, prefix="/auth")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)