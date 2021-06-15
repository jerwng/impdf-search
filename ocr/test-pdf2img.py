from pdf2image import convert_from_path

pages = convert_from_path('A32NX.pdf')

for page in pages:
    page.save('out.jpg', 'JPEG')