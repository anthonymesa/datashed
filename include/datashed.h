
#ifndef DATASHED_H
#define DATASHED_H

#include "datastream.h"

typedef struct sqlite3 sqlite3;

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

DataShed *data_shed_create(void);
void data_shed_init(DataShed *shed);
void data_shed_destroy(DataShed *shed);
void data_shed_free(DataShed *shed);

int data_shed_sqlite_ensure_schema(sqlite3 *db);
int data_shed_sqlite_save(sqlite3 *db, const DataShed *shed);
int data_shed_sqlite_load(sqlite3 *db, DataShed *shed);

#endif
