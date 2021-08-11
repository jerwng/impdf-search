import os
import pytesseract
import cv2
import numpy as np
import io
import json
import shutil
import threading
import time
import logging


from base64 import encodebytes, b64encode
from pdf2image import convert_from_path
from pytesseract import Output # import Output from Pytesseract to get image_to_data to output in dict

def pdf_to_photos(i_path, o_pdir, unique_filename):
    # Split unique filename to remove .pdf extension
    unique_filename_spt = unique_filename.split(".")
  
    # makedirs creates intermediate directories, don't need to check if o_pdir is valid
    o_dir = os.path.join(o_pdir, unique_filename_spt[0]) 
    os.makedirs(o_dir)
    
    pages = convert_from_path(i_path)

    encoded_photos = []

    # Enumerate to record page number
    # Used to uniquely identity converted photos
    for i, page in enumerate(pages):
        photo_name = "{}.jpg".format(str(i))
        photo_path = os.path.join(o_dir, photo_name)

        # Encode the translated pdf images to bytes. 
        # This will be used by the API to send the images back to client.
        # Solution provided from https://stackoverflow.com/a/64067673
        byte_arr = io.BytesIO()
        page.save(byte_arr, format='JPEG') # convert the PIL image to byte array
        encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii')
        encoded_photos.append(encoded_img)
        
        page.save(photo_path, 'JPEG')
    
    return encoded_photos

def ocr(photos_dir):

    config = ("-l eng --oem 1 --psm 11")

    res_arr = {}

    for photo_name in os.listdir(photos_dir):
        if photo_name.endswith(".jpg"):
            photo_name_spt = photo_name.split(".")

            res_pic_dict = {}

            photo_path = os.path.join(photos_dir, photo_name)
        
            img = cv2.imread(photo_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            ocr_res = pytesseract.image_to_data(img, config=config, output_type=Output.DICT)

            # make text search insensitive, remove np.char.lower for case sensitive
            words = np.char.lower(np.array(ocr_res['text']))
            top = np.array(ocr_res['top'])
            left = np.array(ocr_res['left'])
            width = np.array(ocr_res['width'])
            height = np.array(ocr_res['height'])

            empty_words_index = np.where(words == "")

            words_cleaned = np.delete(words, empty_words_index)
            top_cleaned = np.delete(top, empty_words_index)
            left_cleaned = np.delete(left, empty_words_index)
            width_cleaned = np.delete(width, empty_words_index)
            height_cleaned = np.delete(height, empty_words_index)

            res_pic_dict["words"] = words_cleaned.tolist()
            res_pic_dict["top"] = top_cleaned.tolist()
            res_pic_dict["left"] = left_cleaned.tolist()
            res_pic_dict["width"] = width_cleaned.tolist()
            res_pic_dict["height"] = height_cleaned.tolist()

            # Use the integer of the photo name (photo index) as the key
            # so it can be sorted in json.dumps() below
            res_arr[int(photo_name_spt[0])] = res_pic_dict
    
    ocr_path = os.path.join(photos_dir, "ocr.txt")

    with open(ocr_path, "w") as f_ocr:
        f_ocr.write(json.dumps(res_arr, sort_keys=True))
        f_ocr.close()

def search_word_photo(photos_dir, words):
    ocr_file_path = os.path.join(photos_dir, "ocr.txt")

    encoded_search_word_photos = []

    with open(ocr_file_path, "r") as f_ocr:
        ocr_json = json.load(f_ocr)

        for key, value in ocr_json.items():
            photo_words = np.array(value["words"])
            photo_words_top = np.array(value["top"])
            photo_words_left = np.array(value["left"])
            photo_words_width = np.array(value["width"])
            photo_words_height = np.array(value["height"])

            search_words = np.array(words)

            words_index = compare_words(search_words, photo_words)

            if (words_index.size > 0):
                search_words_top = photo_words_top[words_index]
                search_words_left = photo_words_left[words_index]
                search_words_width = photo_words_width[words_index]
                search_words_height = photo_words_height[words_index]

                # Each dictionary key contains the photo name
                photo_path = os.path.join(photos_dir, "{}.jpg".format(key))

                img = cv2.imread(photo_path)  
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

                for search_words_i, search_words_y in enumerate(search_words_top):
                    search_words_x = search_words_left[search_words_i]
                    search_words_w = search_words_width[search_words_i]
                    search_words_h = search_words_height[search_words_i]

                    pad = 5

                    cv2.rectangle(img, (search_words_x - pad, search_words_y - pad), (search_words_w + search_words_x + pad, search_words_h + search_words_y + pad), (0, 0, 255), 3)
                
                encoded_img = b64encode(cv2.imencode(".JPEG", img)[1]).decode('ascii')

                encoded_search_word_photos.append(encoded_img)

            # Return all photos if no search words given (len = 0)
            elif (len(search_words) == 0):
                photo_path = os.path.join(photos_dir, "{}.jpg".format(key))

                img = cv2.imread(photo_path)  
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                encoded_img = b64encode(cv2.imencode(".JPEG", img)[1]).decode('ascii')

                encoded_search_word_photos.append(encoded_img)

    return encoded_search_word_photos

def compare_words(search_words, photo_words):
    '''
    Check each search word to see if it is a substring for any entries in photo_words
    '''
    search_words_indexes = np.array([], dtype="int32")
    for search_word in search_words:
        # For the given search word, check if search word is a substring of an entry in photo_words
        # Solution provided by: https://stackoverflow.com/a/38974252
        search_word_indexes = np.nonzero(np.core.defchararray.find(photo_words, search_word) != -1)
        search_words_indexes = np.append(search_words_indexes, search_word_indexes)
    
    return search_words_indexes

def delete_photo(photos_dir):
    '''
    '''
    # Delete directory
    if os.path.exists(photos_dir):
        shutil.rmtree(photos_dir)

def cleanup(photos_pdir):
    interval = 10
    threading.Timer(interval * 60, cleanup, [photos_pdir]).start()
    cur_time = time.time()

    threshold = 10

    logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.INFO)
    logging.info("Running cleanup function...")

    for f in os.listdir(photos_pdir):
        photos_dir = os.path.join(photos_pdir, f)
        creation_time = os.path.getctime(photos_dir)

        if (cur_time - creation_time > (60 * threshold)):
            if os.path.exists(photos_dir):
                shutil.rmtree(photos_dir)

                logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.INFO)
                logging.info("Deleted folder - {}: Older than {} min".format(photos_dir, threshold))
  
    logging.basicConfig(format='[%(levelname)s] %(asctime)s - %(message)s', level=logging.INFO)
    logging.info("Cleanup function complete")
                
                