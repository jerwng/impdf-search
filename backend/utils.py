import pytesseract
import cv2
import numpy as np
import boto3
import os

from pdf2image import convert_from_bytes
from pytesseract import Output # import Output from Pytesseract to get image_to_data to output in dict
from dotenv import load_dotenv
from botocore.client import Config

load_dotenv()

'''
For each PDF page, converts, saves to JPEG and performs OCR.

Params:
pdf: PDF file received by the server
id (str): Generated unique file name for the given PDF.

Returns (Tuple): 
(
    photos_url (List of str): URL to each page's converted JPEG stored on AWS S3
    ocr_dict (Dict): OCR result for the PDF file
    id (str): Generated unique file name for the given PDF
              (Returned, since the data is returned to a different API.)
)
'''
def pdf_to_photos(pdf, id):
    s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

    pages = convert_from_bytes(pdf)

    # Enumerate to record page number
    # Used to uniquely identity converted photos
    photos_url = []
    ocr_dict = {}
    for i, page in enumerate(pages):
        img = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2BGR)

        # Encode the image and upload the file to AWS S3 storage.
        # Solution provided from https://stackoverflow.com/a/35804056
        img_str = cv2.imencode(".jpg", img)[1].tostring()
        s3.put_object(Bucket="impdf-searcher", Key = "{}/{}.jpg".format(id, i), Body=img_str, ContentType='image/jpeg')
        # Generate the URL to allow temporary public access to the file on S3
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': 'impdf-searcher',
                'Key': "{}/{}.jpg".format(id, i)
            },
            ExpiresIn=3600
        )

        ocr_dict[i] = ocr(img)
    

        photos_url.append(url)
    
    return photos_url, ocr_dict, id

'''
Performs OCR for the given image.

Params:
img (str): toString() of the encoded image by cv2.imencode

Returns (Dict):
{
    "words" (List of str):  List of words found on the image.
    "top" (List of str): The top position for each word found on the image.
    "left" (List of str): The left position for each word found on the image.
    "width" (List of str): The width of each word found on the image.
    "height" (List of str): The height of each word found on the image.
}
'''
def ocr(img):
    config = ("-l eng --oem 1 --psm 11")

    res_pic_dict = {}

    # NOTE: Changing tesseract path is necessary to host server on Heroku.
    if os.getenv("HEROKU_ENV") in {'True'}:
        pytesseract.pytesseract.tesseract_cmd = os.getenv('TESSERACT_PATH')

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

'''
Find the given file's JPEGs for any of the given search words.
Generates highlighted JPEGs for all the search words occurences. 

Params:
data (Dict):
{
    id (str): The file ID for the PDF file
    searchWord (str): The words to be searched on the PDF file
    ocr (Dict): The OCR data for the PDF file
}

Returns (List of str):
A list of URLs for the highlighted JPEGs stored on AWS S3
'''
def search_word_photo(data):
    load_dotenv()
    s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

    search_word_photo_urls = []

    id = data["id"]
    search_words = np.array(data["searchWord"])

    # Delete previous searched images for the given file ID
    delete_folder("{}/search/".format(id))

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

            img = s3.get_object(Bucket='impdf-searcher', Key="{}/{}.jpg".format(id, key))
            img = img['Body'].read()
    
            img = cv2.imdecode(np.asarray(bytearray(img)), cv2.IMREAD_COLOR)

            for search_words_i, search_words_y in enumerate(search_words_top):
                search_words_x = search_words_left[search_words_i]
                search_words_w = search_words_width[search_words_i]
                search_words_h = search_words_height[search_words_i]

                pad = 5

                cv2.rectangle(img, (search_words_x - pad, search_words_y - pad), (search_words_w + search_words_x + pad, search_words_h + search_words_y + pad), (0, 0, 255), 3)
            
            img_str = cv2.imencode(".jpg", img)[1].tostring()
            s3.put_object(Bucket="impdf-searcher", Key = "{}/{}/{}.jpg".format(id, "search", key), Body=img_str, ContentType='image/jpeg')

            url = s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': 'impdf-searcher',
                    'Key': "{}/{}/{}.jpg".format(id, "search", key)
                },
                ExpiresIn=3600
            )

            search_word_photo_urls.append(url)

    return search_word_photo_urls


'''
Check each search word to see if it is a substring for any entries in photo_words

Params:
    search_words (List of str): Words to see if are in any of the images
    photo_words (List of str): The words detected on the image by OCR 

Returns (Numpy Array of int32):
    The indices (page number) where the search words are a substring of words 
    found on the index image.
'''
def compare_words(search_words, photo_words):
    search_words_indexes = np.array([], dtype="int32")
    for search_word in search_words:
        # For the given search word, check if search word is a substring of an entry in photo_words
        # Solution provided by: https://stackoverflow.com/a/38974252
        search_word_indexes = np.nonzero(np.core.defchararray.find(photo_words, search_word) != -1)
        search_words_indexes = np.append(search_words_indexes, search_word_indexes)
    
    return search_words_indexes

'''
Deletes the images with the given prefix key (folder) on AWS S3

Params:
    prefix_key (str): The prefix key (folder) of the images to be deleted.
'''
def delete_folder(prefix_key):
    # Deleting objects with given prefix in the key
    # Solution provided by: https://stackoverflow.com/a/53836093
    s3 = boto3.resource("s3")
    bucket = s3.Bucket("impdf-searcher")
    bucket.objects.filter(Prefix=prefix_key).delete()
                

    # Note: Objects are automatically deleted after 1 day as a result of
    # the 'Delete after 1 minute' Lifecycle Rule set in S3.
    # Therefore, no manual clean-up of old files is necessary.
    # Solution provided by: https://stackoverflow.com/a/57609606 AND
    # https://youtu.be/GIFbmf_Rpvs AND https://youtu.be/sCksXOIaYAw