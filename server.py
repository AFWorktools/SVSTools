from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/unassigned')
def unassigned():
    return render_template('unassigned.html') 

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")