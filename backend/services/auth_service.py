from models.request.auth_request import RegisterRequest
from database.database import get_db
from typing import Annotated
from fastapi import Depends
from fastapi.security.http import HTTPAuthorizationCredentials
from fastapi.security.http import HTTPBearer
from fastapi.security.oauth2 import OAuth2PasswordBearer
from datetime import timezone
from datetime import timedelta
from datetime import datetime
from jose import (
    jwt,
    JWTError
)
from fastapi import status
from fastapi import HTTPException
from sqlalchemy.orm import undefer
from sqlalchemy.exc import SQLAlchemyError
from models.user import User
import bcrypt
import os
from sqlalchemy.orm import Session

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")

ALGORITHM = "HS256"

class UserService:
    security_scheme  = HTTPBearer()
    
    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(
            bytes(password, encoding="UTF-8"),
            bcrypt.gensalt(),
        ).decode("UTF-8")

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        return bcrypt.checkpw(
            bytes(password, encoding="UTF-8"),
            bytes(hashed, encoding="UTF-8")
        )

    @staticmethod
    def create_access_token(user: User) -> str:
        
        expired_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        return jwt.encode({
                "sub": str(user.id), "exp": expired_at
            }, SECRET_KEY, algorithm=ALGORITHM)

    @classmethod
    def check_for_payload(cls, token: HTTPAuthorizationCredentials) -> int | None :
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return int(user_id)

    @classmethod
    def register(cls, request: RegisterRequest, db: Session) -> User:
        existing_user = cls.get_user(email=request.email, db=db)
        
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email address is already registered."
            )

        new_user = User(
            name = request.name,
            email = request.email,
            password_hash = cls.hash_password(request.password),
        )

        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            return new_user
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_user(cls, email: str, db: Session) -> User | None:
        try:
            return db.query(User).options(undefer(User.password_hash)).filter(User.email == email).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_current_user(cls, token: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)], db: Annotated[Session, Depends(get_db)]) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            user_id = cls.check_for_payload(token)

            user = db.query(User).filter(User.id == user_id).first()

            if user is None:
                raise credentials_exception

            return user
        except (JWTError, ValueError) as e:
            print(f"JWT Verification Failed: {str(e)}") 
            raise credentials_exception from e