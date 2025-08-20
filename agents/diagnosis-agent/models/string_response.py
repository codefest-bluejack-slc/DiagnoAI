from pydantic import BaseModel

class StringResponse(BaseModel):
    result: str