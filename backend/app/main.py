from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .index import router as index_router  # Import index router
from .AI import ai_router   # Import AI router
from .gitrepo import router as gitrepo_router  # Import gitrepo router
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# print(os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN"))

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Adjust this if necessary
    allow_origins=["https://frontend-184359031908.us-central1.run.app", "http://localhost:3000"],  # Adjust this if necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(index_router)
app.include_router(ai_router)
app.include_router(gitrepo_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
