import os
import cv2
import numpy as np
import json

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

def search_word_photo(photos_dir, words):
    ocr_file_path = os.path.join(photos_dir, "ocr.txt")

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
                photo_path = os.path.join(photos_dir, key)

                img = cv2.imread(photo_path)  
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

                img_h, img_w, img_z = img.shape

                for search_words_i, search_words_y in enumerate(search_words_top):
                    search_words_x = search_words_left[search_words_i]
                    search_words_w = search_words_width[search_words_i]
                    search_words_h = search_words_height[search_words_i]

                    pad = 5

                    cv2.rectangle(img, (search_words_x - pad, search_words_y - pad), (search_words_w + search_words_x + pad, search_words_h + search_words_y + pad), (0, 0, 255), 3)

                cv2.imshow("res", img)
                cv2.waitKey(0)

  
          # print(ocr_json.items())

    return

if __name__ == "__main__":
    PHOTO_DIR = "./photos/"
    photos_dir = os.path.join(PHOTO_DIR, "c00e70ec45f643a2b76511f2885b25c9-A32NX") 
    search_word_photo(photos_dir, ["cabin", "crew"])