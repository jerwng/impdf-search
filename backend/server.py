import uuid
import logging
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
from werkzeug.utils import secure_filename
from rq import Queue
from rq.job import Job
from worker import conn

from utils import delete_folder, delete_folder, search_word_photo

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1000 * 1000 # limit upload to 25 MB
app.config['UPLOAD_EXTENSIONS'] = ['.pdf']

# Create a queue for background jobs
q = Queue(connection=conn)

'''
Home API
Test landing
'''
@app.route('/', methods=['GET'])
def home():
    return '''<h1>Hello World 123</h1>'''

'''
Test API
'''
@app.route('/test/', methods=['GET'])
@cross_origin()
def test():
    return "hello"

'''
POST /pdf/

Receives the PDF file, starts a background job that 
for each PDF page, converts, saves to JPEG and performs OCR.

Request Body:
{
    file: PDF file
}

Returns (JSON): 
{
    jobID (str): The ID of the background job
    fileID (str): The unique filename for the given PDF
}
'''
@app.route('/pdf/', methods=['POST'])
@cross_origin()
def pdf():
    try:
        job_id = None
        
        if request.files:
        
            uploaded_pdf = request.files['file']
            sec_filename = secure_filename(uploaded_pdf.filename)
            id = uuid.uuid4().hex

            # Wants to generate a unique filename to uniquely identify uploaded files
            unique_filename = "{}-{}".format(id, sec_filename)

            unique_filename_no_ext = unique_filename.split('.pdf')[0]
            
            if not(sec_filename.endswith(".pdf")):
              return jsonify({"status": "Invalid file type."}), 400

            # rq bug, so import utils func here
            from utils import pdf_to_photos

            job = q.enqueue_call(
                func=pdf_to_photos, args=(uploaded_pdf.read(), unique_filename_no_ext), result_ttl=30000
            )

            job_id = job.get_id()
        
        return jsonify({"jobID": job_id, "fileID": unique_filename}), 200
    except Exception as e:
        logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
        logging.error(e)
        logging.error(traceback.print_exc())
        return {}, 500

'''
POST /search/

Searches the images for the given file ID to see if any of the pages
contain any of the given words.

Request Body:
{
    id (str): The file ID for the PDF file
    searchWord (str): The words to be searched on the PDF file
    ocr (Dict): The OCR data for the PDF file
}

Returns (JSON):
{
    photos (List of str): The URLs of the highlighted JPEG stored in AWS S3
                  for pages with the searchWord.
}
'''
@app.route('/search/', methods=['POST'])
@cross_origin()
def search():
    try:
        data = request.json

        photos_url =  search_word_photo(data)

        return jsonify({"photos": photos_url}), 200
    except Exception as e:
        logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
        logging.error(e)
        logging.error(traceback.print_exc())
        return {}, 500

'''
GET /results/<job_id>/

Checks if background job with the given job ID is done executing.

URL Parameters:
job_id (str): The Job ID of the background job.

Returns (JSON): 
If job is finished: status code 200
{
    status (str): "Finished"
    photos (List of str): The URLs of the JPEG for each page in the PDF
    ocr (Dict): The OCR data for the PDF file
    id (str): The Job ID for the completed background job
}
If job is NOT finished: status code 202
{
    status (str): "Not yet finished"
    photos (List of str): []
    ocr (Dict): {}
    id (str): None
}
'''
@app.route('/results/<job_id>/', methods=['GET'])
def get_results(job_id):
    job = Job.fetch(job_id, connection=conn)

    if job.is_finished:
        photos, ocr, id = job.result
        return jsonify({"status": "Finished", "photos": photos, "ocr": ocr, "id": id}), 200
    else:
        return {"status": "Not yet finished", "photos": [], "ocr": {}, "id": None}, 202

'''
DELETE /delete/

Deletes the given file's JPEGs from AWS S3.

Request Body:
{
    fileID: The file ID of the to be deleted file
}

'''
@app.route('/delete/', methods=['DELETE'])
def delete():
    try:
        data = request.json

        delete_folder("{}/".format(data['fileID']))

        return 200
    except Exception as e:
        logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
        logging.error(e)
        logging.error(traceback.print_exc())
        return 500

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')