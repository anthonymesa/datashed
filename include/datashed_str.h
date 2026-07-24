#ifndef DATASHED_STR_H
#define DATASHED_STR_H

#include <stdlib.h>
#include <string.h>

static inline char *datashed_strdup_or_null(const char *s) {
        char *copy;
        size_t n;

        if (s == NULL) {
                return NULL;
        }

        n = strlen(s) + 1;
        copy = malloc(n);
        if (copy == NULL) {
                return NULL;
        }

        memcpy(copy, s, n);
        return copy;
}

#endif
