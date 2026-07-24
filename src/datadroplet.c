#include "../include/datadroplet.h"
#include "../include/datashed_str.h"

#include <stdlib.h>

DataFile *data_file_create(DataId id, const char *name, const char *description, const char *path) {
        DataFile *file = calloc(1, sizeof(*file));
        if (file == NULL) {
                return NULL;
        }

        file->id = id;
        file->name = datashed_strdup_or_null(name);
        file->description = datashed_strdup_or_null(description);
        file->path = datashed_strdup_or_null(path);

        if ((name != NULL && file->name == NULL) ||
            (description != NULL && file->description == NULL) ||
            (path != NULL && file->path == NULL)) {
                data_file_destroy(file);
                return NULL;
        }

        return file;
}

void data_file_destroy(DataFile *file) {
        if (file == NULL) {
                return;
        }

        free(file->name);
        free(file->description);
        free(file->path);
        free(file);
}

DataDroplet *data_droplet_create(
        DataId id,
        DataId stream_id,
        DataId parent_id,
        DataDropletType type,
        const char *title,
        const char *description
) {
        DataDroplet *droplet = calloc(1, sizeof(*droplet));
        if (droplet == NULL) {
                return NULL;
        }

        droplet->id = id;
        droplet->stream_id = stream_id;
        droplet->parent_id = parent_id;
        droplet->type = type;
        droplet->completion_status = 0;
        droplet->link_target_id = 0;
        droplet->link_target = NULL;

        droplet->title = datashed_strdup_or_null(title);
        droplet->description = datashed_strdup_or_null(description);
        data_droplet_vec_init(&droplet->children);
        data_file_vec_init(&droplet->attached_files);

        if ((title != NULL && droplet->title == NULL) ||
            (description != NULL && droplet->description == NULL)) {
                data_droplet_destroy(droplet);
                return NULL;
        }

        return droplet;
}

void data_droplet_destroy(DataDroplet *droplet) {
        size_t i;

        if (droplet == NULL) {
                return;
        }

        for (i = 0; i < droplet->children.len; ++i) {
                data_droplet_destroy(droplet->children.items[i]);
        }

        for (i = 0; i < droplet->attached_files.len; ++i) {
                data_file_destroy(droplet->attached_files.items[i]);
        }

        data_droplet_vec_free(&droplet->children);
        data_file_vec_free(&droplet->attached_files);
        free(droplet->title);
        free(droplet->description);
        free(droplet);
}

void data_file_vec_init(DataFileVec *vec) {
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}

int data_file_vec_push(DataFileVec *vec, DataFile *item) {
        if (datashed_reserve_ptrs((void ***)&vec->items, &vec->cap, vec->len + 1) != 0) {
                return -1;
        }

        vec->items[vec->len++] = item;
        return 0;
}

void data_file_vec_free(DataFileVec *vec) {
        free(vec->items);
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}

void data_droplet_vec_init(DataDropletVec *vec) {
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}

int data_droplet_vec_push(DataDropletVec *vec, DataDroplet *item) {
        if (datashed_reserve_ptrs((void ***)&vec->items, &vec->cap, vec->len + 1) != 0) {
                return -1;
        }

        vec->items[vec->len++] = item;
        return 0;
}

void data_droplet_vec_free(DataDropletVec *vec) {
        free(vec->items);
        vec->items = NULL;
        vec->len = 0;
        vec->cap = 0;
}
