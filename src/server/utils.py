import os
import pytesseract
import cv2
import numpy as np
import io

from base64 import encodebytes
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
        photo_name = "{}-{}.jpg".format(unique_filename_spt[0], str(i))
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

            res_arr[photo_name] = res_pic_dict
    
    return res_arr
