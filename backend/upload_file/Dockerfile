FROM python:3.10
RUN mkdir /upload_image
WORKDIR /upload_image
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m pip install -U pydantic pydantic-extra-types pydantic-settings pydantic[email]
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
COPY . .
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
EXPOSE 8005