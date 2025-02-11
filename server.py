from flask import Flask, request, render_template
from helpers import process_table_input, filter_table

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

@app.route('/compare', methods=['GET', 'POST'])
def compare_excel():
    if request.method == 'GET':
        return render_template('compare.html')
    
    vision_data = request.form['visionInput']
    tool_data = request.form['toolInput']
    filtered_table = filter_table(vision_data, tool_data)

    return render_template('compare.html', table=filtered_table)

if __name__ == '__main__':
    app.run(debug=True)