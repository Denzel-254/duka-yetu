"""Pytest configuration and fixtures for Duka Yetu tests."""

import pytest
import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

# Add the app directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings

# Test database URL - use in-memory SQLite for tests
TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./test.db"  # Use SQLite for testing
)

@pytest.fixture(scope="session")
def test_engine():
    """Create test database engine."""
    # Use SQLite for testing
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_session(test_engine) -> Generator[Session, None, None]:
    """Create test database session."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture
def client(test_session) -> Generator[TestClient, None, None]:
    """Create test client with database session."""
    def override_get_db():
        try:
            yield test_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers():
    """Create authentication headers for testing."""
    return {"Authorization": "Bearer test_token"}

@pytest.fixture
def test_user_data():
    """Provide test user data."""
    return {
        "business_name": "Test Business",
        "owner_name": "Test Owner",
        "email": "test@example.com",
        "phone": "0712345678",
        "password": "StrongPass123!",
        "business_type": "retail",
    }

@pytest.fixture
def test_product_data():
    """Provide test product data."""
    return {
        "name": "Test Product",
        "sku": "TP001",
        "selling_price": 1000.00,
        "cost_price": 800.00,
        "stock_quantity": 50,
    }
