import pymysql
import threading

con = pymysql.connect(host='localhost',
                      user='myrecipes',
                      password='g3iCv7sr!',
                      db='myrecipes',
                      cursorclass=pymysql.cursors.DictCursor)

query_lock = threading.Lock()