#ifndef DATASHED_VEC_H
#define DATASHED_VEC_H

#include "cvec.h"

/* Backward-compatible aliases for existing datashed code. */
#define DATASHED_VEC_INITIAL_CAPACITY CVEC_INITIAL_CAPACITY

static inline int datashed_vec_next_capacity(size_t current, size_t *out) {
        return cvec_next_capacity(current, out);
}

static inline int datashed_reserve_items(void **items, size_t *cap, size_t needed, size_t item_size) {
        return cvec_reserve(items, cap, needed, item_size);
}

static inline int datashed_reserve_ptrs(void ***items, size_t *cap, size_t needed) {
        return cvec_reserve_ptrs(items, cap, needed);
}

#endif