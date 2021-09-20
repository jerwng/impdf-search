import os
import uuid
import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from utils import pdf_to_photos, ocr, search_word_photo, delete_photo, cleanup

app = Flask(__name__, static_folder='../../build', static_url_path='/')
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1000 * 1000 # limit upload to 25 MB
app.config['UPLOAD_EXTENSIONS'] = ['.pdf']

PDF_DIR = "./pdf/"
PHOTO_DIR = "./photos/"

# Remake the photos directory on server start to clean out any left over photos
if os.path.exists(PHOTO_DIR):
    shutil.rmtree(PHOTO_DIR)

os.makedirs(PHOTO_DIR)

cleanup(PHOTO_DIR)

@app.route('/test/', methods=['GET'])
@cross_origin()
def test():
    return "hello"

@app.route('/pdf/', methods=['POST'])
@cross_origin()
def pdf():
    try:
        ocr_res = dict()

        encoded_photos = []
        unique_filename_spt = ""
        
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

            # gets the unique filename without .pdf extension
            unique_filename_spt = unique_filename.split(".")
            o_dir = os.path.join(PHOTO_DIR, unique_filename_spt[0]) 

            ocr(o_dir)

            if os.path.exists(file_path):
                os.remove(file_path)
        
        return jsonify({"photos": encoded_photos, "uniqueFileName": unique_filename_spt[0]}), 200
    except Exception as e:
      return {}, 500

@app.route('/search/', methods=['POST'])
@cross_origin()
def search():
  # need: unique filename, search words
  try:
      data = request.json

      photos_dir = os.path.join(PHOTO_DIR, data["uniqueFileName"]) 

      encoded_photos =  search_word_photo(photos_dir, data["searchWord"])

      return jsonify({"photos": encoded_photos}), 200
  except IOError as not_found:
      return jsonify({"message": "Current session has expired - Please re-upload PDF"}), 410
  except Exception as e:
      return {}, 500

@app.route("/disconnect/", methods=['DELETE'])
@cross_origin()
def disconnect():
    try:
        data = request.json

        photos_dir = os.path.join(PHOTO_DIR, data["uniqueFileName"])

        delete_photo(photos_dir)

        return {}, 200
    except Exception as e:
      return {}, 500
