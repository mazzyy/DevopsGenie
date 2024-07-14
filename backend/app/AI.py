from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv()

ai_router = APIRouter()

class UserInput(BaseModel):
    user_input: str

# Configure the Google Generative AI with your API key
genai.configure(api_key=os.getenv("gemini_key"))

@ai_router.post("/api/generate")
async def generate_pipeline(user_input: UserInput):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate the content based on the user input
        response = model.generate_content(
            f"Generate a GitHub Actions CI/CD pipeline for the following project: {user_input.user_input}. "
            "The pipeline should include steps for checking out the code, setting up the environment, "
            "installing dependencies, running tests, building the project, and deploying it. Provide the configuration in YAML format"
        )
        
        # Return the generated content to the frontend
        return {"pipeline_content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
