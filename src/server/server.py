import os
import uuid
import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from utils import pdf_to_photos, ocr

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1000 * 1000 # limit upload to 25 MB
app.config['UPLOAD_EXTENSIONS'] = ['.pdf']

PDF_DIR = "./pdf/"
PHOTO_DIR = "./photos/"

@app.route('/test/', methods=['GET'])
@cross_origin()
def test():
    return "hello"

@app.route('/pdf/', methods=['POST'])
@cross_origin()
def pdf():
    ocr_res = dict()
    
    if request.files:

        if not os.path.exists(PDF_DIR):
            os.makedirs(PDF_DIR)
    
        uploaded_pdf = request.files['file']
        sec_filename = secure_filename(uploaded_pdf.filename)
        id = uuid.uuid4().hex

        # Wants to generate a unique filename to uniquely identify uploaded files
        unique_filename = "{}-{}".format(id, sec_filename)
        
        if not(sec_filename.endswith(".pdf")):
          return "Invalid file type.", 400

        file_path = os.path.join(PDF_DIR, unique_filename)

        uploaded_pdf.save(file_path)

        encoded_photos = pdf_to_photos(file_path, PHOTO_DIR, unique_filename)

        unique_filename_spt = unique_filename.split(".")  
        o_dir = os.path.join(PHOTO_DIR, unique_filename_spt[0]) 

        ocr_res = ocr(o_dir)

        if os.path.exists(file_path):
            os.remove(file_path)
        
        if os.path.exists(o_dir):
            shutil.rmtree(o_dir)
    
    return jsonify({"photos": encoded_photos, "ocr": ocr_res}), 200