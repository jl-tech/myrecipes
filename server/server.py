import flask
import sys
from flask_cors import CORS

APP = Flask(__name__)
CORS(APP)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: server.py [port]")
    APP.run(port=(int(sys.argv[1]) if len(sys.argv) == 2))