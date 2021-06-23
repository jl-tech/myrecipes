from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    return render_template('index.html',url='123')


if __name__ == '__main__':
    app.run()