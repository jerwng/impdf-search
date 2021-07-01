import os
from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/test', methods=['GET'])
@cross_origin()
def test():
    return "hello"

@app.route('/pdf', methods=['POST'])
@cross_origin()
def pdf():
    if request.files:
        uploaded_pdf = request.files['pdf']
        uploaded_pdf.save(os.path.join("/pdf/", secure_filename(uploaded_pdf.filename)))