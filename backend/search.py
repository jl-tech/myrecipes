import os

import helpers
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys

def do_search(name, type, serving_size, ingredients, key_word):
    return 1;