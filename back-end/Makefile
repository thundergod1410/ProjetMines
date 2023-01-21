#
# Back-end Very Useful Development Makefile
#

# app parameters
include local.mk

ifndef APP
$(error missing APP macro)
endif

SHELL	= /bin/bash
.ONESHELL:

ifndef PYTHON
PYTHON	= python
endif

.PHONY: default
default: clean

F.py	= $(filter-out version.py, $(wildcard *.py))
F.sql	= $(wildcard *.sql)
F.conf	= $(wildcard *.conf)
F.in	= $(wildcard *.in)
F.md	= $(wildcard *.md */*.md)

F.html	= $(F.md:%.md=%.html)

F.csv	= $(F.in:%.in=%.csv)
F.gen	= version.py $(APP).wsgi

F.src	= $(F.py) $(F.gen) $(F.csv) $(F.sql) $(F.conf) Makefile

#
# Local Postgres Database
#

PG		= psql -X -v ON_ERROR_STOP=1 -v name=$(APP)
PGOPT	=
DB		= $(APP)

.postgres: create.sql data.sql drop.sql $(F.csv)
	shopt -s -o pipefail errexit
	createdb $(DB) || exit 1
	$(PG) $(PGOPT) -f drop.sql -f create.sql -f data.sql $(DB) | tee $@

#
# Cleanup
#

.PHONY: clean
clean: full-stop
	$(RM) app.log app.pid $(F.gen) $(F.csv) *~
	$(RM) -r __pycache__ .pytype .pytest_cache .postgres
	dropdb $(DB) || exit 0

.PHONY: clean.venv
clean.venv: clean
	$(RM) -r venv .mypy_cache

#
# Python Virtual Env
#
venv:
	$(PYTHON) -m venv venv
	source venv/bin/activate
	pip install -U pip
	pip install pytest requests mypy pytype flake8 types-requests
	pip install FlaskSimpleAuth cachetools anodb passlib bcrypt psycopg

#
# Generated files
#

version.py: $(F.py) $(F.sql) Makefile
	remote=$$(git config --get remote.origin.url)
	branch=$$(git rev-parse --abbrev-ref HEAD)
	rev=$$(git log -1|head -1|cut -d' ' -f2)
	date=$$(git log -1 --date=iso8601 | sed -n 3p | cut -c 9-27 | tr ' ' 'Z')
	len=$$(git log | grep '^commit ' | wc -l)
	if [ "$$(git status | grep 'nothing to commit')" ] ; then
	  changed=""
	else
	  changed="M"
	fi
	{
	  echo "remote = \"$$remote\""
	  echo "branch = \"$$branch\""
	  echo "commit = \"$$len$$changed ($$rev)\""
	  echo "date = \"$$date\""
	} > $@

$(APP).wsgi:
	{
	  echo "# GENERATED FILE, DO NOT EDIT!"
	  echo "import os"
	  echo "os.environ[\"APP_NAME\"] = \"$(APP)\""
	  echo "os.environ[\"APP_CONFIG\"] = \"/home/$(APP)/conf/server.conf\""
	  echo "from app import app as application"
	} > $@

$(F.csv): venv
%.csv: %.in
	source venv/bin/activate
	./pass2csv.py < $< > $@

#
# Flask process management
#

# defaults for local tests
FLASK		= flask
FLASK.opt	= --host="0.0.0.0"

app.pid: venv version.py .postgres
	source venv/bin/activate
	export APP_NAME=$(APP) APP_CONFIG="local.conf"
	type $(FLASK) || exit 1  # check for flask
	$(FLASK) --debug --app=app.py run $(FLASK.opt) >> app.log 2>&1 &
	echo $$! > app.pid

.PHONY: run
run: app.pid

HAS_CLT	= $(shell type colortail > /dev/null 2>&1 && echo 1)
HAS_STB	= $(shell type stdbuf > /dev/null 2>&1 && echo 1)

ifeq ($(HAS_CLT)$(HAS_STB),11)
TAIL	= stdbuf -i0 -o0 -e0 colortail -n 30 -k .colortail.conf -q
else
TAIL	= tail
endif

.PHONY: log
log: app.pid
	$(TAIL) -f app.log

.PHONY: stop
stop:
	# soft stop…
	[ -f app.pid ] && kill $$(cat app.pid)
	$(RM) app.pid

ifeq ($(shell uname), Linux)
PKILL	= pkill
else
PKILL	= pkill -f
endif

.PHONY: full-stop
full-stop: stop
	# hard stop…
	$(PKILL) $(FLASK) || exit 0

#
# Local tests
#

LOCAL	= http://0.0.0.0:5000
PYTEST	= pytest --log-level=debug --capture=tee-sys
PYTOPT	=

.PHONY: check.version
check.version:
	curl -i -X GET $(LOCAL)/version

.PHONY: check.local.version
check.local.version: check.version

.PHONY: check.pytest
check.pytest: venv $(F.src)
	shopt -s -o errexit
	source venv/bin/activate
	# start test server
	export APP_NAME=$(APP) APP_CONFIG="local.conf"
	$(MAKE) run
	sleep 2
	curl -s $(LOCAL)/version || { echo "# flask did not start!" >&2 ; exit 1 ; }
	# run tests
	export APP_AUTH="calvin:hobbes,hobbes:calvin" APP_URL="$(LOCAL)"
	$(PYTEST) $(PYTOPT) -v test.py
	# stop test server
	$(MAKE) stop

.PHONY: check.local.pytest
check.local.pytest: check.pytest

.PHONY: check.mypy
check.mypy: venv $(F.py) $(F.gen)
	# report syntax and type errors
	source venv/bin/activate
	mypy --ignore-missing-imports --implicit-optional $(F.py) $(F.gen)

.PHONY: check.pytype
check.pytype: venv $(F.py) $(F.gen)
	# report syntax and type errors
	source venv/bin/activate
	pytype $(F.py) $(F.gen)

.PHONY: check.flake8
check.flake8: venv $(F.py) $(F.gen)
	source venv/bin/activate
	flake8 --ignore=E128,E302,E305,F401,E402,E501 $(F.py) $(F.gen)

.PHONY: check
check: clean
	shopt -s -o errexit
	$(MAKE) check.mypy
	$(MAKE) check.flake8
	$(MAKE) check.pytest
	$(MAKE) clean

#
# DEPLOY
#
include deploy.mk
