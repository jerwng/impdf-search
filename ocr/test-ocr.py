import cv2
import pytesseract
import numpy as np

from pytesseract import Output # import Output from Pytesseract to get image_to_data to output in dict

img = cv2.imread("out.jpg")
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

config = ("-l eng --oem 1 --psm 11")

res = pytesseract.image_to_data(img, config=config, output_type=Output.DICT)

print(res.keys())

words = np.array(res['text'])
top = np.array(res['top'])
left = np.array(res['left'])
width = np.array(res['width'])
height = np.array(res['height'])

empty_words_index = np.where(words == "")

words_cleaned = np.delete(words, empty_words_index)
top_cleaned = np.delete(top, empty_words_index)
left_cleaned = np.delete(left, empty_words_index)
width_cleaned = np.delete(width, empty_words_index)
height_cleaned = np.delete(height, empty_words_index)

print(words_cleaned)

cv2.imshow("test", img)

cv2.waitKey(0)