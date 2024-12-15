//This is a project that can encrypt any type of text file (PDF, DOCX, TXT) using Caeser Cipher

//HEADER FILES
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

//CUSTOM DATATYPE
typedef uint8_t BYTE;

//MAIN FUNCTION
int main(int argc, char *argv[])
{
    //FILE HANDLING AND ERROR CHECKING
    FILE *inptr = fopen(argv[1], "r");
    FILE *outptr = fopen(argv[2], "w");

    int key = atoi(argv[3]);
    
    if (inptr == NULL || outptr == NULL || key < 1)
    {
        printf("Something went wrong\n");
        return 1;
    }

    //CAESER CIPHER ALGORITHM
    BYTE buff;
    
    while(fread(&buff, sizeof(char), 1, inptr) != 0)
    {
        if((buff >= 'A' && buff <= 'Z') || (buff >= 'a' && buff <= 'z'))
        {
            buff += key;
            if ((buff > 'Z' && buff < 'a') || (buff > 'z'))
            {
                buff -= 26;
            }
        }
        fwrite(&buff, sizeof(char), 1, outptr);
    }
    return 0;
}