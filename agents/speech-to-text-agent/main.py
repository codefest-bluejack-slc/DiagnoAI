from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from models.messages import AIRequest, AIResponse
from config import ConfigLoader
from openai import OpenAI
from io import BytesIO
import openai

app = FastAPI(title="Speech Recognition API")
config_loader = ConfigLoader()
client = OpenAI(
    api_key=config_loader.get_str("OPENAI_API_KEY")
)

@app.post("/transcribe", response_model=AIResponse)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
):
    """
    Endpoint to transcribe audio files.
    The audio file is expected to be sent as multipart/form-data.
    """

    ai_request = AIRequest(language='en')
    audio_file = await file.read()
    print(f"Received file: {file.filename}, size: {len(audio_file)} bytes")

    try:
        audio_buffer = BytesIO(audio_file)
        audio_buffer.name = file.filename
        
        transcription = client.audio.transcriptions.create(
            file=audio_buffer,
            model="whisper-1",
            language=ai_request.language if ai_request.language else None
        )
    except openai.BadRequestError as e:
        raise HTTPException(status_code=400, detail=f"Bad request: {str(e)}")
    except openai.AuthenticationError as e:
        raise HTTPException(status_code=401, detail="Authentication failed: Invalid API key")
    except openai.PermissionDeniedError as e:
        raise HTTPException(status_code=403, detail=f"Permission denied: {str(e)}")
    except openai.NotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Resource not found: {str(e)}")
    except openai.RateLimitError as e:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
    except openai.InternalServerError as e:
        raise HTTPException(status_code=500, detail="OpenAI service temporarily unavailable")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during transcription: {str(e)}")

    return AIResponse(text=transcription.text)