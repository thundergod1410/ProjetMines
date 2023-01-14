#
# shared global access to the database through AnoDB
#
# DB can be imported and used in any module, including blueprints.
#

import logging
from typing import Any
from FlaskSimpleAuth import Reference, Flask, Response  # type: ignore
import anodb  # type: ignore

log = logging.getLogger(__name__)

# empty proxy
db: Any = Reference(max_size=0, max_delay=60.0)

#
# *ALWAYS* commit after successful request execution
#
# Otherwise the connection is left 'idle in transaction',
# which blocks dumps and the like.
#
def db_commit(res: Response):
    try:
        if 200 <= res.status_code and res.status_code < 400:
            db.commit()
        else:
            db.rollback()
        return res
    except Exception as err:
        log.warning(f"db.commit() failed: {err}")
        return "", 500
    finally:
        # return to internal pool, getter called automatically on any db access
        db._ret_obj()

# db actual per-thread initialization
def init_app(app: Flask):
    log.info(f"initializing database for {app.name}")
    cf = app.config
    db.set(fun=lambda i: anodb.DB(cf["DB_TYPE"], cf["DB_CONN"], cf["DB_SQL"], **cf["DB_OPTIONS"]))
    app.after_request(db_commit)
