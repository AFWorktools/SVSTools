from flask import Flask, request, render_template
from helpers import process_table_input

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/unassigned', methods=['GET', 'POST'])
def unassigned():
    if request.method == 'POST':
        table_input = request.form['tableInput']
        processed_table = process_table_input(table_input)
        return render_template('unassigned.html', table=processed_table)

    return render_template('unassigned.html')

if __name__ == '__main__':
    app.run(debug=True)