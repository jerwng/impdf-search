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

from utils import pdf_to_photos, search_word_photo

# TODO: Replace with this line in production
# app = Flask(__name__, static_folder='app/build', static_url_path='/')
app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1000 * 1000 # limit upload to 25 MB
app.config['UPLOAD_EXTENSIONS'] = ['.pdf']

q = Queue(connection=conn)

@app.route('/test/', methods=['GET'])
@cross_origin()
def test():
    return "hello"

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
            
            if not(sec_filename.endswith(".pdf")):
              return "Invalid file type.", 400

            from utils import pdf_to_photos

            job = q.enqueue_call(
                func=pdf_to_photos, args=(uploaded_pdf.read(),), result_ttl=5000
            )

            job_id = job.get_id()
        
        return jsonify({"jobID": job_id}), 200
    except Exception as e:
        logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.ERROR)
        logging.error(e)
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
      logging.error(e)
      logging.error(traceback.print_exc())
      return {}, 500

@app.route('/results/<job_id>/', methods=['GET'])
def get_results(job_id):
    job = Job.fetch(job_id, connection=conn)

    if job.is_finished:
        return str(job.result), 200
    else:
        return "Not yet finished", 202

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')