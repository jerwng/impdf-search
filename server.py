import uuid
import logging
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from utils import pdf_to_photos, search_word_photo

app = Flask(__name__, static_folder='../../build', static_url_path='/')
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1000 * 1000 # limit upload to 25 MB
app.config['UPLOAD_EXTENSIONS'] = ['.pdf']

# Remake the photos directory on server start to clean out any left over photos

@app.route('/test/', methods=['GET'])
@cross_origin()
def test():
    return "hello"

@app.route('/pdf/', methods=['POST'])
@cross_origin()
def pdf():
    try:
        encoded_imgs = []
        unique_filename_spt = ""
        ocr_dict = {}
        
        if request.files:
        
            uploaded_pdf = request.files['file']
            sec_filename = secure_filename(uploaded_pdf.filename)
            id = uuid.uuid4().hex

            # Wants to generate a unique filename to uniquely identify uploaded files
            unique_filename = "{}-{}".format(id, sec_filename)
            
            if not(sec_filename.endswith(".pdf")):
              return "Invalid file type.", 400

            encoded_imgs, ocr_dict = pdf_to_photos(uploaded_pdf.read())

            # gets the unique filename without .pdf extension
            unique_filename_spt = unique_filename.split(".")
        
        return jsonify({"photos": encoded_imgs, "uniqueFileName": unique_filename_spt[0], "ocr": ocr_dict}), 200
    except Exception as e:
        logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
        logging.error(traceback.print_exc())
        return {}, 500

@app.route('/search/', methods=['POST'])
@cross_origin()
def search():
  try:
      data = request.json

      encoded_photos =  search_word_photo(data)

      return jsonify({"photos": encoded_photos}), 200
  except Exception as e:
      logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
      logging.error(traceback.print_exc())
      return {}, 500

