import httpx
from fastapi.responses import RedirectResponse

from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from urllib.parse import urlencode

from app.api.v1.deps import get_db, get_current_user
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, Token
from app.schemas.user import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """로컬 회원가입 후 JWT 발급"""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        provider="local",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """로컬 로그인 후 JWT 발급"""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/google/login")
def google_login():
    """
    구글 로그인 페이지로 리다이렉트
    """
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        # TODO: state를 세션/쿠키에 저장해서 CSRF 방어까지 하고 싶으면 여기서 추가
    }

    url = f"{settings.google_auth_base_url}?{urlencode(params)}"
    return RedirectResponse(url)


@router.get("/google/callback", response_model=Token)
async def google_callback(
    code: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    구글에서 돌아온 code로 토큰 교환 + user 생성/로그인 + 우리 JWT 발급
    """
    # 1) code -> 토큰 교환
    data = {
        "code": code,
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "redirect_uri": settings.google_redirect_uri,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(settings.google_token_url, data=data)
        if token_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange code for token",
            )

        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No access token in response",
            )

        # 2) access_token으로 유저 정보 가져오기
        userinfo_resp = await client.get(
            settings.google_userinfo_url,
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if userinfo_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch user info",
            )

        userinfo = userinfo_resp.json()
        email = userinfo.get("email")
        name = userinfo.get("name")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google account has no email",
            )

    # 3) DB에서 사용자 조회/생성
    user = db.query(User).filter(User.email == email).first()
    if not user:
        dummy_password = hash_password("google-login")
        user = User(
            email=email,
            password_hash=dummy_password,
            name=name,
            provider="google",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if user.provider != "google":
            user.provider = "google"
            db.commit()
            db.refresh(user)

    # 4) 우리 서비스용 JWT 발급
    access_token = create_access_token(str(user.id))

    # 프론트로 리다이렉트 (토큰은 쿠키로 전달)
    frontend_base = settings.frontend_base_url or "http://localhost:3000"
    redirect_url = frontend_base.rstrip("/")
    resp = RedirectResponse(url=redirect_url)
    # 개발 환경: JS에서 읽을 수 있도록 HttpOnly=False. 필요 시 Secure/Domain 설정 추가.
    resp.set_cookie(
        key="codeme_jwt",
        value=access_token,
        httponly=False,
        samesite="lax",
        path="/",
        max_age=60 * 60 * 24 * 7,  # 7일
    )
    return resp
