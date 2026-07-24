#ifndef CVEC_H
#define CVEC_H

#include <stddef.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#ifndef CVEC_INITIAL_CAPACITY
#define CVEC_INITIAL_CAPACITY 8u
#endif

/*
 * Generic, header-only dynamic array helpers.
 *
 * Conventions:
 * - return 0 on success, -1 on error.
 * - capacity grows by doubling.
 */

static inline int cvec_next_capacity(size_t current, size_t *out) {
        size_t next = current == 0 ? (size_t)CVEC_INITIAL_CAPACITY : current * 2;

        if (next < current) {
                return -1;
        }

        *out = next;
        return 0;
}

static inline int cvec_reserve(void **items, size_t *cap, size_t needed, size_t item_size) {
        size_t target = *cap;

        if (target >= needed) {
                return 0;
        }

        while (target < needed) {
                if (cvec_next_capacity(target, &target) != 0) {
                        return -1;
                }
        }

        if (item_size != 0 && target > (SIZE_MAX / item_size)) {
                return -1;
        }

        void *new_items = realloc(*items, target * item_size);
        if (new_items == NULL) {
                return -1;
        }

        *items = new_items;
        *cap = target;
        return 0;
}

static inline int cvec_reserve_ptrs(void ***items, size_t *cap, size_t needed) {
        return cvec_reserve((void **)items, cap, needed, sizeof(void *));
}

static inline int cvec_push_copy(void **items, size_t *len, size_t *cap, size_t item_size, const void *value) {
        unsigned char *base;

        if (cvec_reserve(items, cap, *len + 1, item_size) != 0) {
                return -1;
        }

        base = (unsigned char *)(*items);
        memcpy(base + ((*len) * item_size), value, item_size);
        *len += 1;
        return 0;
}

static inline void cvec_release(void **items, size_t *len, size_t *cap) {
        free(*items);
        *items = NULL;

        if (len != NULL) {
                *len = 0;
        }

        if (cap != NULL) {
                *cap = 0;
        }
}

#endif
