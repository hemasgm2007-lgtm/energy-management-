import os
import secrets
import smtplib

from datetime import datetime, timedelta
from email.message import EmailMessage

import bcrypt

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# REQUEST MODELS
# ============================================================

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


# ============================================================
# PASSWORD FUNCTIONS
# ============================================================

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


def verify_password(
    password: str,
    password_hash: str
) -> bool:

    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8")
    )


# ============================================================
# SIGN UP
# ============================================================

@router.post("/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == data.email.lower())
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    new_user = User(
        name=data.name.strip(),
        email=data.email.lower(),
        password_hash=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully.",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email.lower())
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password."
        )

    return {
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }


# ============================================================
# SEND RESET EMAIL
# ============================================================

def send_reset_email(
    email: str,
    reset_link: str
):

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(
        os.getenv("SMTP_PORT", "587")
    )
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_host or not smtp_email or not smtp_password:
        raise RuntimeError(
            "Email service is not configured."
        )

    message = EmailMessage()

    message["Subject"] = (
        "Smart Energy - Password Reset"
    )

    message["From"] = smtp_email
    message["To"] = email

    message.set_content(
        f"""
Hello,

We received a request to reset your Smart Energy account password.

Click the link below to create a new password:

{reset_link}

This link will expire in 30 minutes.

If you did not request a password reset, you can ignore this email.

Regards,
Smart Energy Monitoring System
"""
    )

    with smtplib.SMTP(
        smtp_host,
        smtp_port
    ) as server:

        server.starttls()

        server.login(
            smtp_email,
            smtp_password
        )

        server.send_message(message)


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email.lower())
        .first()
    )

    # Don't reveal whether an email exists
    if not user:
        return {
            "message": (
                "If an account exists for this email, "
                "a password reset link has been sent."
            )
        }

    reset_token = secrets.token_urlsafe(32)

    user.reset_token = reset_token

    user.reset_token_expiry = (
        datetime.utcnow() + timedelta(minutes=30)
    )

    db.commit()

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5174"
    )

    reset_link = (
        f"{frontend_url}/reset-password"
        f"?token={reset_token}"
    )

    try:

        send_reset_email(
            user.email,
            reset_link
        )

    except Exception as error:

        print(
            "Email sending error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send reset email."
        )

    return {
        "message": (
            "Password reset link has been "
            "sent to your email."
        )
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.reset_token == data.token)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    if (
        not user.reset_token_expiry
        or user.reset_token_expiry < datetime.utcnow()
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    user.password_hash = hash_password(
        data.password
    )

    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {
        "message": "Password reset successfully."
    }