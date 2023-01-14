#! /usr/bin/env python

import re
import fileinput
import passlib.context as pc

pm = pc.CryptContext("bcrypt", bcrypt__default_rounds=4)
is_comment = re.compile(r"^\s*#").match

for line in fileinput.input():
    if is_comment(line):
        continue
    w = line.strip().split(" ", 2)
    print(f'"{w[0]}","{pm.hash(w[1])}",{w[2] if len(w) > 2 else None}')
