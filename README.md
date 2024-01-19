# impdf-searcher

[Project Link](https://impdf-search.onrender.com)

#### Notes

This project is hosted with on the Free tier of Render / Eco tier of Heroku. Performance will be impacted for large files.<br/>

**_Please limit PDF file size to under 1MB._** <br />
<sup>There is a ~25MB hard limit cap enforced by the server.</sup>

## Purpose

Detect and search text on PDF files with images.

#### Issue

PDF viewers have built-in search text function. However, they are designed to search text directly in the document and fail if the text is embedded within an image.

#### Solution

This project performs optical character recognition (OCR) on the PDF file and allows text to be detected within an image.

## Implementation

### Front End

The front end is built using React.

- The images are displayed directly from Amazon S3 using presigned URLs returned by the server.

### Server

The server is built using Flask.

#### PDF Processing

- Each page in the received PDF is converted to a JPEG image using [pdf2image](https://pypi.org/project/pdf2image/).
- OCR is done on each image using [pytesseract](https://pypi.org/project/pytesseract/).
- Returned to client:
  - A list of presigned image URLs for the converted PDF pages.
  - A JSON object containing the results from OCR.
  ```
  {
    pageNumber:
      {
        words: [],    // List of words found on the page
        top: [],      // List of y-coordnates for each word  on the page
        left: [],     // List of x-coordinates for each word on the page
        width: [],    // List of width for each word on the page
        height: []    // List of height for each word on the page
      }
  }
  ```

#### Word Search

- The entered search words are compared with the words array for each page.
- Images are processed to have red highlight around matched words.
- Presigned URLs for the highlighted images are returned to the client.

#### Storage

The processed image files are stored using Amazon S3.
