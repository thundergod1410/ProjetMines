#
# Projet Mine d'Or
#

import os
import re
import datetime
import logging

# initial logging configuration
logging.basicConfig(level=logging.INFO)

# start and configure flask service
import FlaskSimpleAuth as fsa
from FlaskSimpleAuth import jsonify as json  # type: ignore
app = fsa.Flask(os.environ["APP_NAME"])
app.config.from_envvar("APP_CONFIG")

# setup application log
log = logging.getLogger(app.name)
if "APP_LOGGING_LEVEL" in app.config:
    log.setLevel(app.config["APP_LOGGING_LEVEL"])
started = datetime.datetime.now()
log.info(f"started on {started}")

# create database connection and load queries based on DB_* directives
import database
database.init_app(app)
from database import db

# authentication and authorization for the app
import auth
auth.init_app(app)

#
# General information about running app.
#
# FIXME should be restricted
#
# GET /version (sleep?)
@app.get("/version", authorize="ANY")
def get_version(sleep: float = 0.0):
    import flask
    import aiosql
    import CacheToolsUtils as ctu
    import ProxyPatternPool as ppp
    import version
    # possibly include a delay, for testing purposes…
    if sleep:
        import time
        time.sleep(sleep)
    # describe app
    return {
        # running
        "app": app.name,
        "version": 17,
        "started": str(started),
        # git info
        "git-remote": version.remote,
        "git-branch": version.branch,
        "git-commit": version.commit,
        "git-date": version.date,
        # auth
        "auth": app.config.get("FSA_AUTH", None),
        "user": app.get_user(required=False),
        # database
        "db-type": app.config["DB_TYPE"],
        "db-driver": db._db,
        "db-version": db._db_version,
        "now": db.now(),
        "connections": db._nobjs,
        "hits": app._fsa._cache.hits(),
        # package versions
        "flask-simple-auth": fsa.__version__,
        "flask": flask.__version__,
        "anodb": db.__version__,
        "aiosql": aiosql.__version__,
        "postgres": db.version(),
        "cachetools-utils": ctu.__version__,
        "proxy-pattern-pool": ppp.__version__,
        db._db: db._db_version,
    }, 200

# GET /stats
@app.get("/stats", authorize="ADMIN")
def get_stats():
    dbc = db._count
    return {k: dbc[k] for k in dbc if dbc[k] != 0}, 200

#
# Self care
#

# GET /who-am-i
@app.get("/who-am-i", authorize="ALL")
def get_who_am_i(user: fsa.CurrentUser):
    return user, 200

# POST /register (login, password)
@app.post("/register", authorize="ANY")
def post_register(login: str, password: str):
    # check constraints on "login"
    if len(login) < 3:
        return "login must be at least 3 chars", 400
    if not re.match(r"^[a-zA-Z][-a-zA-Z0-9_\.]+$", login):
        return "login can only contain simple characters", 400
    if db.get_auth_login(login=login) is not None:
        return f"user {login} already registered", 409
    log.debug(f"user registration: {login}")
    # NOTE passwords have constraints, see configuration
    db.insert_auth(login=login, password=app.hash_password(password), is_admin=False)
    return "", 201

# GET /login
@app.get("/login", authorize="ALL", auth="basic")
def get_login(user: fsa.CurrentUser):
    return json(app.create_token(user)), 200

# DELETE /users/<login>  # while testing only…
if app.config.get("APP_TEST", False):
    @app.delete("/users/<login>", authorize="ADMIN")
    def delete_users_login(login: str):
        if not db.get_auth_login_lock(login=login):
            return "no such user", 404
        # in the real world a user would rather be disactivated
        db.delete_user(login=login)
        return "", 204

# ADD NEW CODE HERE

# SHOULD STAY AS LAST LOC
log.debug("running…")
