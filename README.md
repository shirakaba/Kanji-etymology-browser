# Kanji-etymology-browser
Tools to create a lightweight, browsable digital kanji etymology dictionary using scans of the 1988 kanji etymology paperback dictionary by Kenneth G. Henshall. For personal educational use, so only a proof-of-concept release for the first two pages is provided.

# How to use
1) Clone this github directory to your computer using: ```git clone https://github.com/shirakaba/Kanji-etymology-browser.git```.

2) Open ```PNG_LQ/Indexcontainer/Index.htm``` and click to any kanji you'd like to see (as long as it's on one of the first two pages).

3) Other files of interest include ```Completed lookup list.xlsx```, which gives for all the kanji in Henshall's book their corresponding JIS codes, Henshall index number, and Henshall page number. Of use to nobody but me, it additionally contains the coordinate values for cropping the whitespace off an OCR copy, and (more useful) a python script for cropping out such whitespace according to one's own values.
