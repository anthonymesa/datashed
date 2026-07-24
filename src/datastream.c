#include "../include/datastream.h"
#include "../include/datashed_str.h"

#include <stdlib.h>

DataStream *data_stream_create(DataId id, const char *title, const char *description) {
        DataStream *stream = calloc(1, sizeof(*stream));
        if (stream == NULL) {
                return NULL;
        }

        stream->id = id;
        stream->title = datashed_strdup_or_null(title);
        stream->description = datashed_strdup_or_null(description);
        data_droplet_vec_init(&stream->droplets);

        if ((title != NULL && stream->title == NULL) ||
            (description != NULL && stream->description == NULL)) {
                data_stream_destroy(stream);
                return NULL;
        }

        return stream;
}

void data_stream_destroy(DataStream *stream) {
        size_t i;

        if (stream == NULL) {
                return;
        }

        for (i = 0; i < stream->droplets.len; ++i) {
                data_droplet_destroy(stream->droplets.items[i]);
        }

        data_droplet_vec_free(&stream->droplets);
        free(stream->title);
        free(stream->description);
        free(stream);
}

void data_stream_vec_init(DataStreamVec *vec) {
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}

int data_stream_vec_push(DataStreamVec *vec, DataStream *item) {
        if (datashed_reserve_ptrs((void ***)&vec->items, &vec->cap, vec->len + 1) != 0) {
                return -1;
        }

        vec->items[vec->len++] = item;
        return 0;
}

void data_stream_vec_free(DataStreamVec *vec) {
        free(vec->items);
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}
