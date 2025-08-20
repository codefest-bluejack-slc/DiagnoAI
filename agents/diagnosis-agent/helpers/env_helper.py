import os
from dotenv import load_dotenv

ENVS = ["GEMINI_API_KEY", "ELASTIC_HOST", "MEDICAL_INDEX", "SEED_SECRET", "AGENT_ADRESS", "RECOMMENDATION_AGENT_ADDRESS"]

class EnvHelper:
    """Class for gathering and saving all env for the application """
    def __init__(self):
        load_dotenv(dotenv_path='.env', override=True)
        self.envs = {}
        self.gather_envs()
        self.assign_env()

    def gather_envs(self) -> bool:
        """Gather All env for the application if there is a missing value throws error
        Returns:
            bool: _description_
        """
        for env in ENVS:
            env_value = os.getenv(env)
            if env_value is None or env_value == "":
                raise ValueError(f'{env} has value None or empty')

            self.envs[env] = os.getenv(env)
        return True

    def assign_env(self):
        self.GEMINI_API_KEY = self.envs[ENVS[0]]
        self.ELASTIC_HOST = self.envs[ENVS[1]]
        self.MEDICAL_INDEX = self.envs[ENVS[2]]
        self.SEED_SECRET = self.envs[ENVS[3]]
        self.AGENT_ADRESS = self.envs[ENVS[4]]
        self.RECOMMENDATION_AGENT_ADDRESS = self.envs[ENVS[5]]

env_helper = EnvHelper()