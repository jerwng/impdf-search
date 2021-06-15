from skimage.io import imread_collection
import cv2
import os
import numpy as np
import pytesseract

from pytesseract import Output # import Output from Pytesseract to get image_to_data to output in dict

def ocr():
    dir = "pics/"

    img_collection = []

    config = ("-l eng --oem 1 --psm 11")

    res_arr = {}

    for file_name in os.listdir(dir):
        if file_name.endswith(".jpg"):

            res_pic_dict = {}
        
            img = cv2.imread(dir + file_name)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            ocr = pytesseract.image_to_data(img, config=config, output_type=Output.DICT)

            # make text search insensitive, remove np.char.lower for case sensitive
            words = np.char.lower(np.array(ocr['text']))
            top = np.array(ocr['top'])
            left = np.array(ocr['left'])
            width = np.array(ocr['width'])
            height = np.array(ocr['height'])

            empty_words_index = np.where(words == "")

            words_cleaned = np.delete(words, empty_words_index)
            top_cleaned = np.delete(top, empty_words_index)
            left_cleaned = np.delete(left, empty_words_index)
            width_cleaned = np.delete(width, empty_words_index)
            height_cleaned = np.delete(height, empty_words_index)

            res_pic_dict["words"] = words_cleaned
            res_pic_dict["top"] = top_cleaned
            res_pic_dict["left"] = left_cleaned
            res_pic_dict["width"] = width_cleaned
            res_pic_dict["height"] = height_cleaned

            res_arr[file_name] = res_pic_dict
    
    return res_arr

def find_words(imgs, target_word):
    imgs_with_target_word = {}

    for file_name in imgs:
        img = imgs[file_name]

        img_with_target_word = {}

        # case insensitive to make target_word lower case
        # each image words np array are already set to lower case above
        target_word_indexes = np.where(img['words']== target_word.lower())[0]

        if target_word_indexes.size > 0:
            words_target = img['words'][target_word_indexes]
            top_target = img['top'][target_word_indexes]
            left_target = img['left'][target_word_indexes]
            width_target = img['width'][target_word_indexes]
            height_target = img['height'][target_word_indexes]

            img_with_target_word["words"] = words_target
            img_with_target_word["top"] = top_target
            img_with_target_word["left"] = left_target
            img_with_target_word["width"] = width_target
            img_with_target_word["height"] = height_target

            imgs_with_target_word[file_name] = img_with_target_word

    return imgs_with_target_word
 
if __name__ == "__main__":
    img_arr = ocr()

    test_word = "flAPS"

    res = find_words(img_arr, test_word)

    print(res)
