FROM python:3.12.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

# Run the app
CMD ["python", "-m", "main"]
