import os

import helpers
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys

def do_search(name, type, serving_size, ingredients, key_word):
    query_lock.acquire()
    cur = con.cursor()

    if name is None:
        name = "%"
    if type is None:
        type = "%"
    if serving_size is None:
        serving_size = "%"

    query = "select * from Recipes where name LIKE %s AND type LIKE %s AND serving_size LIKE %s"
    cur.execute(query, (name, type, serving_size,))
    result = cur.fetchall()





    return 1;

