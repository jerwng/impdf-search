# impdf-searcher
[Heroku Link](http://impdf-searcher.herokuapp.com)

## Purpose
Detect and search text on PDF files with images.

#### Issue
PDF viewers have built-in search text function. However, they are designed to search text directly in the document and fail if the text is embedded within an image. 

#### Solution
This project performs optical character recognition (OCR) on the PDF file. This allows text to be detected even if it is within an image.

## Implementation
#### Front End
The front end is built using React.

* The images are displayed directly from Amazon S3 using presigned URLs returned by the server.

#### Server
The server is built using Flask.

##### PDF Processing
* Each page in the received PDF is converted to a JPEG image using [pdf2image](https://pypi.org/project/pdf2image/).
* OCR is done on each image using [pytesseract](https://pypi.org/project/pytesseract/).
* Returned to client:
    * A list of presigned image URLs for the converted PDF pages.
    * A JSON object containing the results from OCR.
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

##### Word Search
* The entered search words are compared with the words array for each page.
* Images are processed to have red highlight around matched words.
* Presigned URLs for the highlighted imagess are returned to the client.

#### Storage
The processed image files are stored using Amazon S3.

## Notes
This project is hosted with on the free tier of Heroku. As a result, computation resources are limited and large PDF files will result in long wait times.

***Please limit PDF file size to under 1MB.*** <br />
<sup>There is a ~25MB hard limit cap enforced by the server.</sup>

## Next Steps
* Add documentation to server code.
* Implement web sockets to replace polling for better efficiency when waiting for background job ([PDF Processing](#pdf-processing)) to complete.
  
* Display more informative status messages during [PDF Processing](#pdf-processing) and [Word Search](#word-search).
  
* Consolidate / re-organize states in React for greater efficiency.
