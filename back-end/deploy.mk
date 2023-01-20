#
# Deployment Makefile (for development only!)
#
# - you do NOT want to execute "drop.sql" in production!
# - schema management and usage should be distinct
#

.PHONY: clean.deploy
clean: clean.deploy
clean.deploy:
	$(RM) $(F.html)

.PHONY: perms
perms: $(F.gen) $(F.csv) $(F.html)
	chmod a+r $(F.conf) $(F.sql) $(F.py) $(F.gen) $(F.csv) $(F.html)
	if [ -d assets ] ; then
	  find assets -type d -print0 | xargs -0 chmod a+rx
	  find assets -type f -print0 | xargs -0 chmod a+r
	fi

RSYNC	= rsync -rLpgodv

.PHONY: deploy
deploy: perms
	shopt -s -o errexit
	# send files
	$(RSYNC) $(F.conf) $(USER)@$(HOST):conf/
	$(RSYNC) $(F.py) $(F.sql) $(F.gen) $(F.csv) $(USER)@$(HOST):app/
	$(RSYNC) www/*.html $(USER)@$(HOST):www/
	# [ -d assets ] && $(RSYNC) assets/. $(USER)@$(HOST):assets/.
	[ -d static ] && $(RSYNC) static/. $(USER)@$(HOST):static/.
	ssh $(USER)@$(HOST) \
	  psql \
	    -1 \
	    -v name=$(APP) \
	    -v ON_ERROR_STOP=on \
	    -c "\"SET STATEMENT_TIMEOUT TO '10s'\"" \
	    -c "\"\\cd app\"" \
	    -f drop.sql \
	    -f create.sql \
	    -f data.sql \
	    -d \"$(DBCONN)\"
	ssh $(USER)@$(HOST) \
	  touch app/$(APP).wsgi

# execute some script
%.exe: %.sql
	shopt -s -o errexit
	ssh $(USER)@$(HOST) \
	  psql \
	    -1 \
	    -v name=$(APP) \
	    -v ON_ERROR_STOP=on \
	    -f app/$*.sql \
	    -d "$(DBCONN)"

%.html: %.md
	pandoc -s -o $@ $<

# check deployed server
URL	= $(SERVER)/api

.PHONY: check.server.version
check.server.version:
	curl -s -i -u $(NOADM) $(URL)/version || exit 1

.PHONY: check.server.stats
check.server.stats:
	curl -s -i -u $(ADMIN) $(URL)/stats || exit 1

.PHONY: check.server.pytest
check.server.pytest:
	export APP_AUTH="$(ADMIN),$(NOADM)" APP_URL="$(URL)"
	$(PYTEST) $(PYTOPT) -v test.py
