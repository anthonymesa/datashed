
#ifndef DATASHED_MODEL_H
#define DATASHED_MODEL_H

#include <stddef.h>
#include <stdint.h>

// data represents a normal leaf with data. link represents
// a direct link to another droplet, like a soft symlink.
typedef enum data_droplet_type {
        DATA,
        LINK,
} DataDropletType;

typedef uint64_t DataId;
typedef struct sqlite3 sqlite3;

typedef struct data_file {
        DataId id;
        char *name;
        char *description;
        char *path;
} DataFile;

struct data_droplet;
struct data_stream;

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

typedef struct data_stream_vec {
        struct data_stream **items;
        size_t len;
        size_t cap;
} DataStreamVec;

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

typedef struct data_stream {
        DataId id;
        char *title;
        char *description;
        DataDropletVec droplets;
} DataStream;

typedef struct data_shed {
        DataStreamVec streams;
} DataShed;

/*
 * Ownership model:
 * - DataShed owns all DataStream entries in streams.
 * - DataStream owns all root DataDroplet entries in droplets.
 * - DataDroplet owns children and attached_files entries.
 * - link_target is non-owning and is never freed through that pointer.
 */

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

DataStream *data_stream_create(DataId id, const char *title, const char *description);
void data_stream_destroy(DataStream *stream);

DataShed *data_shed_create(void);
void data_shed_init(DataShed *shed);
void data_shed_destroy(DataShed *shed);
void data_shed_free(DataShed *shed);

void data_file_vec_init(DataFileVec *vec);
int data_file_vec_push(DataFileVec *vec, DataFile *item);
void data_file_vec_free(DataFileVec *vec);

void data_droplet_vec_init(DataDropletVec *vec);
int data_droplet_vec_push(DataDropletVec *vec, DataDroplet *item);
void data_droplet_vec_free(DataDropletVec *vec);

void data_stream_vec_init(DataStreamVec *vec);
int data_stream_vec_push(DataStreamVec *vec, DataStream *item);
void data_stream_vec_free(DataStreamVec *vec);

int data_shed_sqlite_ensure_schema(sqlite3 *db);
int data_shed_sqlite_save(sqlite3 *db, const DataShed *shed);
int data_shed_sqlite_load(sqlite3 *db, DataShed *shed);

#endif
