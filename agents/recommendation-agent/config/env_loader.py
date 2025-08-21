import os

class EnvLoader:
    @staticmethod
    def get_str(key: str, default: str = "") -> str:
        return os.getenv(key, default)
    
    @staticmethod
    def get_int(key: str, default: int = -1) -> int:
        try:
            value = os.getenv(key, str(default))
            return int(value)
        except ValueError:
            return default
        
    @staticmethod
    def get_float(key: str, default: float = 0.0) -> float:
        try:
            value = os.getenv(key, str(default))
            return float(value)
        except ValueError:
            return default