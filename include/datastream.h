#ifndef DATASTREAM_H
#define DATASTREAM_H

#include "datadroplet.h"

#include <stddef.h>

struct data_stream;

typedef struct data_stream_vec {
        struct data_stream **items;
        size_t len;
        size_t cap;
} DataStreamVec;

typedef struct data_stream {
        DataId id;
        char *title;
        char *description;
        DataDropletVec droplets;
} DataStream;

DataStream *data_stream_create(DataId id, const char *title, const char *description);
void data_stream_destroy(DataStream *stream);

void data_stream_vec_init(DataStreamVec *vec);
int data_stream_vec_push(DataStreamVec *vec, DataStream *item);
void data_stream_vec_free(DataStreamVec *vec);

#endif
