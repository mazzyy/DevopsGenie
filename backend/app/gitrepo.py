from fastapi import APIRouter, HTTPException
import requests
from pydantic import BaseModel
from dotenv import load_dotenv
import os

class RepoAnalysis(BaseModel):
    owner: str
    repo: str
    languages: dict
    frameworks: list
    folder_structure: dict
load_dotenv()

router = APIRouter()

print(os.getenv('PERSONAL_ACCESS_TOKEN_GITHUB'))

GITHUB_TOKEN = os.getenv("PERSONAL_ACCESS_TOKEN_GITHUB") # Replace with your actual token

headers = {
    "Authorization": f"token {GITHUB_TOKEN}"
}

def fetch_folder_structure(owner: str, repo: str, path=""):
    # print(os.getenv("PERSONAL_ACCESS_TOKEN_GITHUB"))
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json().get("message"))

    contents = response.json()
    structure = {}
    for item in contents:
        if item['type'] == 'dir':
            structure[item['name']] = fetch_folder_structure(owner, repo, item['path'])
        else:
            structure[item['name']] = 'file'

    return structure

@router.get("/analyze_repo", response_model=RepoAnalysis)
async def analyze_repo(owner: str, repo: str):
    try:
        repo_url = f"https://api.github.com/repos/{owner}/{repo}"
        languages_url = f"{repo_url}/languages"
        
        repo_response = requests.get(repo_url, headers=headers)
        if repo_response.status_code != 200:
            raise HTTPException(status_code=repo_response.status_code, detail=repo_response.json().get("message"))

        repo_data = repo_response.json()
        
        languages_response = requests.get(languages_url, headers=headers)
        if languages_response.status_code != 200:
            raise HTTPException(status_code=languages_response.status_code, detail=languages_response.json().get("message"))

        languages_data = languages_response.json()
        folder_structure = fetch_folder_structure(owner, repo)

        frameworks = []  # Dummy frameworks list for example
        if 'Python' in languages_data:
            frameworks.append('FastAPI')
        if 'JavaScript' in languages_data:
            frameworks.append('React')

        return {
            "owner": owner,
            "repo": repo,
            "languages": languages_data,
            "frameworks": frameworks,
            "folder_structure": folder_structure
        }
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail="Error accessing GitHub API")
