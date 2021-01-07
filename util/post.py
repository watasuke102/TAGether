#!/usr/bin/env python
import sys
import subprocess

args = sys.argv

try:
  if args[1] == "--help" or args[1] == "-h":
    print("Usage: ./post.sh <title> <description> <tag>")
    exit(0)
except IndexError:
  pass

try:
  title = args[1]
except IndexError:
  title = "title"
try:
  desc = args[2]
except IndexError:
  desc = "desc"
try:
  tag = args[3]
except IndexError:
  tag = ""

com0 = 'curl -X POST -H "Content-Type: application/json" "http://api.watasuke.tk" -d '
com1 = "'{"
com2 = '"title":"{}","desc":"{}","tag":"{}"'.format(title, desc, tag)
com3 = ',"list":"[{\\"question\\":\\"1+1=?\\",\\"answer\\":\\"2\\"},{\\"question\\":\\"5+5=?\\",\\"answer\\":\\"10\\"}]"'
com4 = "}'"

print(com0+com1+com2+com3+com4)

