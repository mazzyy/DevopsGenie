# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .database import SessionLocal, engine
# from . import models, schemas, crud
# import requests
# from dotenv import load_dotenv
# import os

# models.Base.metadata.create_all(bind=engine)

# gitrouter = APIRouter()

# # GITHUB_PERSONAL_ACCESS_TOKEN =  os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")


# @router.get("/github/callback")
# def github_callback(code: str, db: Session = Depends(get_db)):
#     url = "https://github.com/login/oauth/access_token"
#     headers = {"Accept": "application/json"}
#     data = {
#         "client_id": "your_github_client_id",
#         "client_secret": "your_github_client_secret",
#         "code": code
#     }
#     response = requests.post(url, headers=headers, data=data)
#     response_data = response.json()
#     if "access_token" not in response_data:
#         raise HTTPException(status_code=400, detail="Failed to retrieve access token")
#     access_token = response_data["access_token"]

#     user_info = requests.get(
#         "https://api.github.com/user",
#         headers={"Authorization": f"Bearer {access_token}"}
#     ).json()
    
#     # Example processing user info and saving to the database
#     # user = crud.get_user_by_github_id(db, github_id=user_info["id"])
#     # if not user:
#     #     user = crud.create_user(db, user_info)
    
#     return {"access_token": access_token, "user_info": user_info}

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
