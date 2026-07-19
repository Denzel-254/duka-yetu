"""
One-time / ops script to create or reset the platform SUPER_ADMIN.

Usage (Docker):
  docker compose exec api python scripts/create_super_admin.py --password 'YourStrongPass1'

Usage (local):
  python scripts/create_super_admin.py --username superadmin --password 'YourStrongPass1'

If --password is omitted, uses SUPER_ADMIN_PASSWORD from the environment.
"""

from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

# Allow running as `python scripts/create_super_admin.py` from repo root / container /app
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings  # noqa: E402
from app.core.database import SessionLocal, init_db  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.models.user import User  # noqa: E402


def create_or_update_super_admin(username: str, password: str, email: str) -> str:
    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters.")
    if not (
        any(c.isupper() for c in password)
        and any(c.islower() for c in password)
        and any(c.isdigit() for c in password)
    ):
        raise SystemExit(
            "Password must include at least one uppercase letter, one lowercase letter, and one number."
        )

    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if user:
            user.role = "SUPER_ADMIN"
            user.business_id = None
            user.is_active = True
            user.email = email
            user.password_hash = get_password_hash(password)
            user.login_time = datetime.utcnow()
            db.commit()
            return f"Updated existing user '{username}' to SUPER_ADMIN."

        user = User(
            business_id=None,
            name="Platform Super Admin",
            email=email,
            phone=None,
            username=username,
            password_hash=get_password_hash(password),
            role="SUPER_ADMIN",
            is_active=True,
            login_time=datetime.utcnow(),
        )
        db.add(user)
        db.commit()
        return f"Created SUPER_ADMIN user '{username}'."
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or reset the Duka Yetu super admin")
    parser.add_argument(
        "--username",
        default=(settings.SUPER_ADMIN_USERNAME or "superadmin").strip(),
        help="Super admin username (default: SUPER_ADMIN_USERNAME or superadmin)",
    )
    parser.add_argument(
        "--password",
        default=(settings.SUPER_ADMIN_PASSWORD or "").strip(),
        help="Super admin password (default: SUPER_ADMIN_PASSWORD env)",
    )
    parser.add_argument(
        "--email",
        default=(settings.SUPER_ADMIN_EMAIL or "superadmin@dukayetu.local").strip(),
        help="Super admin email",
    )
    args = parser.parse_args()

    if not args.password:
        raise SystemExit(
            "No password provided. Pass --password 'YourStrongPass1' "
            "or set SUPER_ADMIN_PASSWORD in the environment."
        )

    message = create_or_update_super_admin(args.username, args.password, args.email)
    print(f"✅ {message}")
    print(f"   Login at /login with username: {args.username}")
    print("   You will be redirected to /admin to approve businesses.")


if __name__ == "__main__":
    main()
