#
# Authentication and Authorization Helpers
#

import logging
from typing import Optional
from FlaskSimpleAuth import Flask, ErrorResponse  # type: ignore
from database import db

log = logging.getLogger(__name__)

# authentication helper function
def get_user_pass(login: str) -> Optional[str]:
    res = db.get_auth_login(login=login)
    return res[0] if res else None

# group authorization helper function
def user_in_group(login: str, group: str) -> Optional[bool]:
    res = db.get_auth_login(login=login)
    return (res[1] if group == "ADMIN" else False) if res else None  # fmt: skip

# register authentication and authorization helpers to FlaskSimpleAuth
def init_app(app: Flask):
    log.info(f"initializing auth for {app.name}")
    app.get_user_pass(get_user_pass)
    app.user_in_group(user_in_group)
    # app.object_perms(…)
    app.add_group("ADMIN")
