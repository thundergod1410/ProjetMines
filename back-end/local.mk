#
# Project Settings
#

APP	= minedor

USER	= $(APP)
HOST	= mobapp.minesparis.psl.eu
SERVER	= https://$(APP).$(HOST)

DBCONN	= host=pagode user=$(APP) dbname=$(APP)
ADMIN	= calvin:hobbes
NOADM	= hobbes:calvin
