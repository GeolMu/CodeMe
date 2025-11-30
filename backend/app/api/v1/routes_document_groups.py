from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, get_current_user
from app.api.v1.routes_documents import delete_document_internal
from app.models.document_group import DocumentGroup
from app.models.document import Document
from app.models.user import User
from app.schemas.document_group import (
    DocumentGroupCreate,
    DocumentGroupUpdate,
    DocumentGroupRead,
)
from app.services.blob_storage import get_blob_container_client
from azure.storage.blob import ContainerClient

router = APIRouter(prefix="/document-groups", tags=["document_groups"])


@router.get("/", response_model=list[DocumentGroupRead])
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(DocumentGroup)
        .filter(DocumentGroup.user_id == current_user.id)
        .order_by(DocumentGroup.created_at.asc())
        .all()
    )


@router.post("/", response_model=DocumentGroupRead, status_code=status.HTTP_201_CREATED)
def create_group(
    payload: DocumentGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = DocumentGroup(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
        persona_prompt=payload.persona_prompt,
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@router.patch("/{group_id}", response_model=DocumentGroupRead)
def update_group(
    group_id: UUID,
    payload: DocumentGroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = db.get(DocumentGroup, group_id)
    if not group or group.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

    if payload.name is not None:
        group.name = payload.name
    if payload.description is not None:
        group.description = payload.description
    if payload.persona_prompt is not None:
        group.persona_prompt = payload.persona_prompt

    db.commit()
    db.refresh(group)
    return group


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    container: ContainerClient = Depends(get_blob_container_client),
):
    group = db.get(DocumentGroup, group_id)
    if not group or group.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

    docs = (
        db.query(Document)
        .filter(Document.user_id == current_user.id, Document.group_id == group_id)
        .all()
    )
    for doc in docs:
        delete_document_internal(db, current_user, doc, container)

    db.delete(group)
    db.commit()
