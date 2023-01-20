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
    db.insert_auth(login=login, password=app.hash_password(password), isAdmin=False, email=None)
    return "", 201

# GET /login
@app.get("/login", authorize="ALL", auth="basic")
def get_login(user: fsa.CurrentUser):
    return json(app.create_token(user)), 200

# GET /users
@app.get("/users", authorize="ADMIN")
def get_users(filter: str = None):
    if filter is not None:
        res = db.get_auth_filter(filter=filter)
    else:
        res = db.get_auth_all()
    return json(res), 200

# POST /users
@app.post("/users", authorize="ADMIN")
def post_users(login: str, password: str, isAdmin: bool = False, email: str = None):
    # this fails if the login already exists
    db.insert_auth(login=login, password=password, isAdmin=isAdmin, email=email) 
    return "", 201

# GET /users/<login>
@app.get("/users/<login>", authorize="ADMIN")
def get_users_login(login: str):
    res = db.get_auth_data_login(login=login)
    if not res:
        return "no such user", 404
    else:
        return json(res), 200

# DELETE /users/<login>
@app.delete("/users/<login>", authorize="ADMIN")
def delete_users_login(login: str):
    if not db.check_auth_login(login=login):
        return "no such user", 404
    db.delete_auth(login=login)
    return "", 204

# PUT /users/<login>
# PATCH /users/<login>
@app.route("/users/<login>", methods=["PUT", "PATCH"], authorize="ADMIN")
def patch_users_login(login: str, password: str = None, isAdmin: bool = None, email: str = None):
    res = db.check_users_login(login=login)
    if not res:
        return "", 404
    if password is not None:
        db.upd_auth_email(login=login, password=app.hash_password(password))
    if isAdmin is not None:
        db.upd_auth_isAdmin(login=login, isAdmin=isAdmin)
    if email is not None:
        db.upd_auth_email(login=login, email=email)
    return "", 204


# GET /ann
@app.get("/ann", authorize="ALL")
def get_ann(filter: str = None):
    if filter is None:
        res = db.get_ann_all()
    else:
        res = db.get_ann_filter(filter=filter)
    return json(res), 200

# GET /ann/filter
@app.get("/ann/filter", authorize="ALL")
def get_ann_filter(title_filter: str = '%', description_filter: str = '%', price_max: float = float('inf'), over: bool = False):
    res = db.get_ann_filter_new(title_filter=title_filter, description_filter=description_filter, price_max=price_max, over=over)
    return json(res), 200

# POST /ann
@app.post("/ann", authorize="ALL")
def post_ann(title: str, starting_price: float, lid: int, description: str = None, expiration: str = None, ceiling_price: float = None):
    db.insert_ann(title=title, description=description, expiration=expiration, starting_price=starting_price, current_price=starting_price, ceiling_price=ceiling_price, lid=lid)
    return "", 201

# GET /ann/<aid>
@app.get("/ann/<aid>", authorize="ALL")
def get_ann_aid(aid: int):
    res = db.get_ann_aid(aid=aid)
    if not res:
        return "", 404
    else:
        return json(res), 200

# DELETE /ann/<aid>
@app.delete("/ann/<aid>", authorize="ADMIN")
def delete_ann_aid(aid: int):
    if not db.check_ann_aid(aid=aid):
        return "no such announcement", 404
    db.delete_ann(aid=aid)
    return "", 204

# GET /ann/user/<login>
@app.get("/ann/user/<login>", authorize="ALL")
def get_ann_login(login: str):
    if not db.check_auth_login(login=login):
        return "no such user", 404
    res = db.get_ann_login(login=login)
    return json(res), 200

# SHOULD STAY AS LAST LOC
log.debug("running…")
