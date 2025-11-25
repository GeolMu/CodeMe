from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ---- 기본 앱 설정 ----
    project_name: str = "CodeMe"
    api_v1_str: str = "/api/v1"
    environment: str = "local"

    # CORS Origins (JSON 문자열 또는 쉼표로 구분된 문자열을 넣어도 됨)
    backend_cors_origins: List[str] = []

    # ---- DB ----
    # .env 의 DATABASE_URL 을 읽어옴
    database_url: str

    # ---- JWT / 인증 ----
    jwt_secret_key: str
    access_token_expire_minutes: int = 60

    # ---- Google OAuth ----
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_redirect_uri: Optional[str] = None

    # ---- Azure Blob Storage ----
    azure_storage_connection_string: Optional[str] = None
    azure_blob_container: str = "user-docs"
    max_upload_size_mb: int = 20

    # ---- Azure OpenAI (임베딩) ----
    azure_openai_endpoint: Optional[str] = None
    azure_openai_api_key: Optional[str] = None
    azure_openai_embed_deployment: Optional[str] = None

    # ---- Azure AI Search ----
    azure_search_endpoint: Optional[str] = None
    azure_search_admin_key: Optional[str] = None
    azure_search_index_name: Optional[str] = None

    # ---- n8n ↔ FastAPI 콜백 ----
    fastapi_callback_url: Optional[str] = None
    n8n_callback_token: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # 정의 안 된 env 변수는 무시 (더 이상 extra_forbidden 안 뜸)
    )


settings = Settings()