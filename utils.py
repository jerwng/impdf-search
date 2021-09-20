import os
import pytesseract
import cv2
import numpy as np
import io

from base64 import encodebytes, b64encode, b64decode
from pdf2image import convert_from_bytes
from pytesseract import Output # import Output from Pytesseract to get image_to_data to output in dict

def pdf_to_photos(o_pdir, unique_filename, pdf):
    # Split unique filename to remove .pdf extension
    unique_filename_spt = unique_filename.split(".")
  
    # makedirs creates intermediate directories, don't need to check if o_pdir is valid
    o_dir = os.path.join(o_pdir, unique_filename_spt[0]) 
    os.makedirs(o_dir)
    
    # pages = convert_from_path(i_path)
    pages = convert_from_bytes(pdf)

    encoded_imgs = []

    # Enumerate to record page number
    # Used to uniquely identity converted photos
    ocr_dict = {}
    for i, page in enumerate(pages):
        img = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2BGR)

        ocr_dict[i] = ocr(i, img)

        # Encode the translated pdf images to bytes. 
        # This will be used by the API to send the images back to client.
        # Solution provided from https://stackoverflow.com/a/64067673
        byte_arr = io.BytesIO()
        page.save(byte_arr, format='JPEG') # convert the PIL image to byte array
        encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii')
        encoded_imgs.append(encoded_img)
    
    return encoded_imgs, ocr_dict

def ocr(i, img):
    config = ("-l eng --oem 1 --psm 11")

    res_pic_dict = {}

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

    return res_pic_dict

def search_word_photo(data):
    encoded_search_word_photos = []
    search_words = np.array(data["searchWord"])

    for key, value in data["ocr"].items():
        photo_words = np.array(value["words"])
        photo_words_top = np.array(value["top"])
        photo_words_left = np.array(value["left"])
        photo_words_width = np.array(value["width"])
        photo_words_height = np.array(value["height"])

        words_index = compare_words(search_words, photo_words)

        if (words_index.size > 0):
            search_words_top = photo_words_top[words_index]
            search_words_left = photo_words_left[words_index]
            search_words_width = photo_words_width[words_index]
            search_words_height = photo_words_height[words_index]

            # Decode the given encoded image from client 
            # for cv2 to read and highlight search words
            # Decode solution provided from: https://stackoverflow.com/a/54205640
            img_encoded = np.fromstring(b64decode(data["allPhotos"][int(key)]), np.uint8)
            img = cv2.imdecode(img_encoded, cv2.IMREAD_COLOR)

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
            encoded_search_word_photos = data["allPhotos"]

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
                
                