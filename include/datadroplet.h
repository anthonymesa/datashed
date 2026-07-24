#ifndef DATADROPLET_H
#define DATADROPLET_H

#include "datashed_vec.h"

#include <stddef.h>
#include <stdint.h>

// data represents a normal leaf with data. link represents
// a direct link to another droplet, like a soft symlink.
typedef enum data_droplet_type {
        DATA,
        LINK,
} DataDropletType;

typedef uint64_t DataId;

typedef struct data_file {
        DataId id;
        char *name;
        char *description;
        char *path;
} DataFile;

struct data_droplet;

typedef struct data_file_vec {
        DataFile **items;
        size_t len;
        size_t cap;
} DataFileVec;

typedef struct data_droplet_vec {
        struct data_droplet **items;
        size_t len;
        size_t cap;
} DataDropletVec;

typedef struct data_droplet {
        DataId id;
        DataId stream_id;
        DataId parent_id;
        char *title;
        char *description;
        DataDropletType type;
        int completion_status; // 0 or 1

        // link_target_id is the persisted relationship for SQLite.
        DataId link_target_id;
        struct data_droplet *link_target;

        DataDropletVec children;
        DataFileVec attached_files;
} DataDroplet;

DataFile *data_file_create(DataId id, const char *name, const char *description, const char *path);
void data_file_destroy(DataFile *file);

DataDroplet *data_droplet_create(
        DataId id,
        DataId stream_id,
        DataId parent_id,
        DataDropletType type,
        const char *title,
        const char *description
);
void data_droplet_destroy(DataDroplet *droplet);

void data_file_vec_init(DataFileVec *vec);
int data_file_vec_push(DataFileVec *vec, DataFile *item);
void data_file_vec_free(DataFileVec *vec);

void data_droplet_vec_init(DataDropletVec *vec);
int data_droplet_vec_push(DataDropletVec *vec, DataDroplet *item);
void data_droplet_vec_free(DataDropletVec *vec);

#endif
