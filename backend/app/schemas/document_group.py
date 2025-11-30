from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentGroupBase(BaseModel):
    name: str
    description: str | None = None
    persona_prompt: str | None = None


class DocumentGroupCreate(DocumentGroupBase):
    pass


class DocumentGroupUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    persona_prompt: str | None = None


class DocumentGroupRead(DocumentGroupBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
