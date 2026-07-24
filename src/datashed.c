#include "../include/datashed.h"
#include "datashed_persist.h"

#include <stdlib.h>

DataShed *data_shed_create(void) {
        DataShed *shed = calloc(1, sizeof(*shed));
        if (shed == NULL) {
                return NULL;
        }

        data_shed_init(shed);
        return shed;
}

void data_shed_init(DataShed *shed) {
        if (shed == NULL) {
                return;
        }

        data_stream_vec_init(&shed->streams);
}

void data_shed_destroy(DataShed *shed) {
        size_t i;

        if (shed == NULL) {
                return;
        }

        for (i = 0; i < shed->streams.len; ++i) {
                data_stream_destroy(shed->streams.items[i]);
        }

        data_stream_vec_free(&shed->streams);
}

void data_shed_free(DataShed *shed) {
        if (shed == NULL) {
                return;
        }

        data_shed_destroy(shed);
        free(shed);
}

int data_shed_sqlite_ensure_schema(sqlite3 *db) {
        return datashed_persist_ensure_schema(db);
}

int data_shed_sqlite_save(sqlite3 *db, const DataShed *shed) {
        return datashed_persist_save(db, shed);
}

int data_shed_sqlite_load(sqlite3 *db, DataShed *shed) {
        return datashed_persist_load(db, shed);
}
