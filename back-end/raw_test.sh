#! /bin/bash
#
# tests avec curl
#

HOST=mobapp.minesparis.psl.eu

[ $# -eq 3 ] || {
  echo "usage: $0 projet login password" >&2
  exit 1
}

name=$1 login=$2 pass=$3

# check GET /path [opts]
function check()
{
  local meth=$1 path=$2
  shift 2
  curl -sSi -X $meth "$@" https://$name.$HOST/api$path
}

check GET /version                   # 200 null
check GET /version -u calvin:hobbes  # 200 calvin
check GET /version -u hobbes:calvin  # 200 hobbes

check GET /stats                     # 401 null
check GET /stats -u calvin:hobbes    # 200 calvin
check GET /stats -u hobbes:calvin    # 403 hobbes

check POST /register -d login="$login" -d password="$pass" # 201
check GET /login -u "$login:$pass"                         # 200
check GET /version -u "$login:$pass"                       # 200 $login
