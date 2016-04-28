#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void){
    FILE *ifp, *ofp;
    char outputFilename[] = "/Users/jamiebirch/Documents/Homework/Masters/Masters exercises/Kanji table generator/out.list";
    
    ifp = fopen("/Users/jamiebirch/Documents/Homework/Masters/Masters exercises/Kanji table generator/indexCSV.csv", "r"); //rt is for reading text
    
    if (ifp == NULL) {
        fprintf(stderr, "Can't open input file in.list!\n");
        exit(1);
    }
    
    ofp = fopen(outputFilename, "w"); // from here to line 22 is the output file routine.
    
    if (ofp == NULL) {
        fprintf(stderr, "Can't open output file %s!\n",
                outputFilename);
        exit(1);
    }
    
    
//    long kanji; /* didn't work */
    char kanji_str[10]; /* stores up to a 10-byte string(?) of characters */
//    wchar_t kanji_wc; /* didn't work */
    long kanji_code; /* Let's try turning this into int */
    char path[20]; /* too spacious; 10 bytes in filepath ../001.png plus 1 byte for saying 'ENDOFSTRING' ?*/
    int page;
    
    char line[80];
    
    while(fgets(line, 80, ifp) != NULL)
    {
        /* get a line, up to 80 chars from fr.  done if NULL */
        sscanf (line, "%s\t%ld\t%10s\t%d\n",kanji_str, &kanji_code, path, &page ); /*scans prescribed number of bytes until it sees a tab, ie. scans no further than a 10-byte string of characters*/
        /* convert the string to a long int */
     /* printf ("%s\t%ld\t%s\t%d\n", kanji_str, kanji_code, path, page);   */
        printf ("<tr>\n\t<td>%s</td>\n\t<td><span onclick=\"changecImg('%s')\">%ld</span></td>\n", kanji_str, path, kanji_code);
        printf ("\t<td><span onclick=\"changerImg('%s')\">%ld</span></td>\n</tr>\n", path, kanji_code);
    }
    
    fclose(ifp);
    return 0;
}