# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Build arguments
ARG PERSONAL_ACCESS_TOKEN_GITHUB
ARG gemini_key

# Set environment variables
ENV PERSONAL_ACCESS_TOKEN_GITHUB=$PERSONAL_ACCESS_TOKEN_GITHUB
ENV gemini_key=$gemini_key

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Command to run the FastAPI app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
