from flask import Flask
from flask import render_template, request, redirect, url_for

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    return render_template('index.html',url='123')




@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'GET':
        return render_template('login.html')

    else:
        usern = request.form.get('username')
        passw = request.form.get('password')

        if usern == 'username' and passw == '123456':
            return redirect('http://127.0.0.1:5000/')

if __name__ == '__main__':
    app.run()