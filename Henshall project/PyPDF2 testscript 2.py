#!/usr/bin/python
#

from PyPDF2 import PdfFileWriter, PdfFileReader
import csv

#input = PdfFileReader(file("Henshall OCR wo Genki or index truncated.pdf", "rb"))
input = PdfFileReader(file("Henshall kanji raw worksize.pdf", "rb"))
output = PdfFileWriter()

numPages = input.getNumPages()
print "document has %s pages." % numPages

f = open("New parameters for coordinate crop.csv", 'rU')
csvReader = csv.reader(f, delimiter="\t")
i = 0
for row in csvReader:
    page = input.getPage(i)
    i += 1
    page.mediaBox.lowerLeft = (row[0], row[1])
    page.mediaBox.upperRight = (row[2], row[3])
    output.addPage(page)


outputStream = file("out3.pdf", "wb")
output.write(outputStream)
outputStream.close()