#ifndef DATASHED_PERSIST_H
#define DATASHED_PERSIST_H

#include "../include/datashed.h"

int datashed_persist_ensure_schema(sqlite3 *db);
int datashed_persist_save(sqlite3 *db, const DataShed *shed);
int datashed_persist_load(sqlite3 *db, DataShed *shed);

#endif